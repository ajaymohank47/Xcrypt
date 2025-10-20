import { useEffect, useState } from 'react';

const CryptoPriceTracker = () => {
  const [cryptoData, setCryptoData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [displayCount, setDisplayCount] = useState(12);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=false');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setCryptoData(data || []);
        setError(null);
      } catch (error) {
        console.error('Error fetching crypto data:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLoadMore = () => {
    setDisplayCount(prev => Math.min(prev + 12, cryptoData.length));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-black flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <div className="text-white text-lg font-medium">Loading crypto data...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-black flex items-center justify-center">
        <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6 max-w-md">
          <div className="text-red-400 text-lg font-medium">Error loading data</div>
          <div className="text-red-300 text-sm mt-2">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-black">
      <header className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700/50 sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Crypto Price Tracker
          </h1>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {cryptoData.slice(0, displayCount).map((crypto) => (
            <div
              key={crypto.id}
              className="group bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:bg-slate-800/60 hover:border-slate-600/50 transition-all duration-300 hover:scale-105"
            >
              <div className="flex items-center space-x-4 mb-4">
                <img
                  src={crypto.image}
                  alt={crypto.name}
                  className="w-14 h-14 rounded-full ring-2 ring-slate-600/30 group-hover:ring-blue-500/30 transition-all duration-300"
                />
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-bold text-white truncate">{crypto.name}</h2>
                  <p className="text-slate-400 text-sm font-medium uppercase tracking-wider">{crypto.symbol}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="text-2xl font-bold text-white">
                  ${crypto.current_price?.toLocaleString()}
                </div>

                <div className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-medium ${crypto.price_change_percentage_24h >= 0
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                    : 'bg-red-500/20 text-red-400 border border-red-500/30'
                  }`}>
                  {crypto.price_change_percentage_24h >= 0 ? '↗' : '↘'}
                  {Math.abs(crypto.price_change_percentage_24h)?.toFixed(2)}%
                </div>

                <div className="text-xs text-slate-500 border-t border-slate-700/50 pt-3">
                  Market Cap: ${(crypto.market_cap / 1e9)?.toFixed(1)}B
                </div>
              </div>
            </div>
          ))}
        </div>

        {displayCount < cryptoData.length && (
          <div className="flex justify-center mt-12">
            <button
              onClick={handleLoadMore}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-full transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Load More ({cryptoData.length - displayCount} remaining)
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default CryptoPriceTracker;