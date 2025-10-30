import { useEffect, useState, useCallback, useRef } from 'react';

const CryptoPriceTracker = () => {
  const [cryptoData, setCryptoData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [displayCount, setDisplayCount] = useState(12);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const intervalRef = useRef(null);

  const fetchData = useCallback(async (isAutoRefresh = false) => {
    try {
      if (!isAutoRefresh) {
        setLoading(true);
      } else {
        setIsRefreshing(true);
      }
      
      const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=false');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setCryptoData(data || []);
      setLastUpdated(new Date());
      setError(null);
    } catch (error) {
      console.error('Error fetching crypto data:', error);
      setError(error.message);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    // Initial fetch
    fetchData();

    // Set up auto-refresh every 30 seconds
    intervalRef.current = setInterval(() => {
      fetchData(true);
    }, 30000);

    // Cleanup interval on component unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fetchData]);

  const handleLoadMore = () => {
    setDisplayCount(prev => Math.min(prev + 12, cryptoData.length));
  };

  const handleManualRefresh = () => {
    fetchData();
  };

  const formatLastUpdated = () => {
    if (!lastUpdated) return '';
    const now = new Date();
    const diff = Math.floor((now - lastUpdated) / 1000);
    
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return lastUpdated.toLocaleTimeString();
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
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2 sm:mb-0">
              Crypto Price Tracker
            </h1>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-slate-400">
                <div className={`w-2 h-2 rounded-full ${isRefreshing ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`}></div>
                <span>
                  {isRefreshing ? 'Updating...' : lastUpdated ? `Updated ${formatLastUpdated()}` : 'Live'}
                </span>
              </div>
              <button
                onClick={handleManualRefresh}
                disabled={isRefreshing}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center space-x-2"
              >
                <svg 
                  className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>{isRefreshing ? 'Updating' : 'Refresh'}</span>
              </button>
            </div>
          </div>
          <div className="mt-2 text-center sm:text-left">
            <p className="text-xs text-slate-500">
              🔄 Auto-updates every 30 seconds • 📊 Real-time market data
            </p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {cryptoData.slice(0, displayCount).map((crypto) => (
            <div
              key={crypto.id}
              className={`group bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:bg-slate-800/60 hover:border-slate-600/50 transition-all duration-300 hover:scale-105 ${isRefreshing ? 'animate-pulse' : ''}`}
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
                <div className="text-2xl font-bold text-white flex items-center justify-between">
                  <span>${crypto.current_price?.toLocaleString()}</span>
                  {isRefreshing && (
                    <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  )}
                </div>

                <div className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-medium ${crypto.price_change_percentage_24h >= 0
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                    : 'bg-red-500/20 text-red-400 border border-red-500/30'
                  }`}>
                  {crypto.price_change_percentage_24h >= 0 ? '↗' : '↘'}
                  {Math.abs(crypto.price_change_percentage_24h)?.toFixed(2)}%
                </div>

                <div className="text-xs text-slate-500 border-t border-slate-700/50 pt-3 flex justify-between items-center">
                  <span>Market Cap: ${(crypto.market_cap / 1e9)?.toFixed(1)}B</span>
                  <div className="flex items-center space-x-1">
                    <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-green-400">Live</span>
                  </div>
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