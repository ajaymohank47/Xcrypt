import React, { useEffect, useState } from 'react';

const CryptoPriceTracker = () => {
  const [cryptoData, setCryptoData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [displayCount, setDisplayCount] = useState(9);

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
    setDisplayCount(prev => Math.min(prev + 9, cryptoData.length));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading crypto data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-red-500 text-xl">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <header className="bg-gray-800 text-white p-4">
        <h1 className="text-2xl font-semibold flex justify-center">Crypto Price Tracker</h1>
      </header>

      <main className="container mx-auto bg-slate-950 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-slate-950 my-4">
          {cryptoData.slice(0, displayCount).map((crypto) => (
            <div key={crypto.id} className="p-4 rounded-lg shadow-md bg-slate-800 flex items-center space-x-4">
              <img 
                src={crypto.image} 
                alt={crypto.name} 
                className="w-12 h-12 rounded-full"
              />
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-white">{crypto.name}</h2>
                <p className="text-gray-400 uppercase">{crypto.symbol}</p>
                <p className="text-2xl font-bold mt-2 text-slate-300">
                  ${crypto.current_price?.toLocaleString()}
                </p>
                <p className={crypto.price_change_percentage_24h >= 0 ? 'text-green-500' : 'text-red-500'}>
                  {crypto.price_change_percentage_24h?.toFixed(2)}%
                </p>
                <p className="text-sm text-gray-500">
                  Market Cap: ${crypto.market_cap?.toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        {displayCount < cryptoData.length && (
          <div className="flex justify-center mt-6">
            <button
              onClick={handleLoadMore}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
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