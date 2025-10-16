import React, { useState, useEffect, useContext } from "react";
import { TransactionContext } from "../context/TransactionContext";

function MyComponent() {
  const { currentAccount } = useContext(TransactionContext);
  
  // Dummy transaction data for preview - always available
  const dummyEtherscanData = {
    result: [
      {
        from: "0x742d35Cc6634C0532925a3b8D4C9db96590c6C87",
        to: "0x8ba1f109551bD432803012645Hac136c22C177ec",
        value: "500000000000000000", // 0.5 ETH in wei
        timeStamp: Math.floor((Date.now() - 86400000) / 1000), // 1 day ago
        isError: "0"
      },
      {
        from: "0x1234567890123456789012345678901234567890",
        to: "0x0987654321098765432109876543210987654321",
        value: "1200000000000000000", // 1.2 ETH in wei
        timeStamp: Math.floor((Date.now() - 172800000) / 1000), // 2 days ago
        isError: "0"
      },
      {
        from: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
        to: "0x1111222233334444555566667777888899990000",
        value: "2800000000000000000", // 2.8 ETH in wei
        timeStamp: Math.floor((Date.now() - 259200000) / 1000), // 3 days ago
        isError: "0"
      },
      {
        from: "0x9876543210987654321098765432109876543210",
        to: "0xfedcbafedcbafedcbafedcbafedcbafedcbafedcba",
        value: "750000000000000000", // 0.75 ETH in wei
        timeStamp: Math.floor((Date.now() - 345600000) / 1000), // 4 days ago
        isError: "0"
      },
      {
        from: "0x5555666677778888999900001111222233334444",
        to: "0xaaaaaabbbbbbccccccddddddeeeeeeffffffffff",
        value: "3500000000000000000", // 3.5 ETH in wei
        timeStamp: Math.floor((Date.now() - 432000000) / 1000), // 5 days ago
        isError: "0"
      },
      {
        from: "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b",
        to: "0xf0e1d2c3b4a59687f0e1d2c3b4a59687f0e1d2c3",
        value: "1800000000000000000", // 1.8 ETH in wei
        timeStamp: Math.floor((Date.now() - 518400000) / 1000), // 6 days ago
        isError: "0"
      },
      {
        from: "0xabc123def456789abc123def456789abc123def4",
        to: "0x456789abc123def456789abc123def456789abc1",
        value: "900000000000000000", // 0.9 ETH in wei
        timeStamp: Math.floor((Date.now() - 604800000) / 1000), // 7 days ago
        isError: "0"
      },
      {
        from: "0x789abc123def456789abc123def456789abc123d",
        to: "0x123def456789abc123def456789abc123def4567",
        value: "2200000000000000000", // 2.2 ETH in wei
        timeStamp: Math.floor((Date.now() - 691200000) / 1000), // 8 days ago
        isError: "1" // Failed transaction
      }
    ]
  };

  // Initialize with dummy data so it's never null
  const [data, setData] = useState(dummyEtherscanData);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [isLoadingReal, setIsLoadingReal] = useState(false);

  const url = `https://api-sepolia.etherscan.io/api?module=account&action=txlist&address=0xA9A9F177d1085AeD15E92Dad3Deb1252E46DF46D&startblock=1&offset=10&page=1&sort=desc&apikey=272XCJSQQFIRC4ZSUCY1V6DQXT1D7J4MS6`;

  useEffect(() => {
    // If we have a current account, try to fetch real data
    if (currentAccount) {
      console.log("Account connected, attempting to fetch real data...");
      setIsLoadingReal(true);
      
      fetch(url)
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
          throw response;
        })
        .then((realData) => {
          console.log("Real Etherscan data loaded:", realData);
          if (realData && realData.result && realData.result.length > 0) {
            setData(realData);
            setError(null);
          } else {
            console.log("No real transactions found, keeping dummy data");
          }
        })
        .catch((fetchError) => {
          console.error("Error fetching Etherscan data, keeping dummy data: ", fetchError);
          setError("Failed to load real data");
          // Keep dummy data when API fails
        })
        .finally(() => {
          setIsLoadingReal(false);
        });
    } else {
      console.log("No account connected - showing dummy transaction data");
      setData(dummyEtherscanData);
      setError(null);
    }
  }, [currentAccount]);

  // Helper function to shorten addresses
  const shortenAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Determine if we're using dummy data
  const isUsingDummyData = !currentAccount || error || data === dummyEtherscanData;

  const renderTransactions = () => {
    // Ensure we always have data to display
    const displayData = data && data.result && Array.isArray(data.result) ? data : dummyEtherscanData;
    const transactionsToDisplay = expanded ? displayData.result : displayData.result.slice(0, 6);

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
        {transactionsToDisplay.map((item, index) => (
          <div key={index} className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-lg p-6 border border-gray-700 hover:border-blue-500 transition-all duration-300">
            
            {/* Transaction Status */}
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-400 text-sm font-medium">Transaction #{index + 1}</span>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                item.isError === "0" 
                  ? "bg-green-500/20 text-green-400 border border-green-500/30" 
                  : "bg-red-500/20 text-red-400 border border-red-500/30"
              }`}>
                {item.isError === "0" ? "✓ Success" : "✗ Failed"}
              </span>
            </div>

            {/* From Address */}
            <div className="mb-3">
              <p className="text-gray-400 text-sm mb-1">From</p>
              <p className="text-white font-mono text-sm bg-gray-700/50 px-3 py-2 rounded-lg">
                {shortenAddress(item.from)}
              </p>
            </div>

            {/* To Address */}
            <div className="mb-3">
              <p className="text-gray-400 text-sm mb-1">To</p>
              <p className="text-white font-mono text-sm bg-gray-700/50 px-3 py-2 rounded-lg">
                {shortenAddress(item.to)}
              </p>
            </div>

            {/* Value */}
            <div className="mb-3">
              <p className="text-gray-400 text-sm mb-1">Value</p>
              <p className="text-blue-400 font-bold text-lg">
                {(item.value * 10 ** -18).toFixed(4)} ETH
              </p>
            </div>

            {/* Date */}
            <div className="mb-0">
              <p className="text-gray-400 text-sm mb-1">Date</p>
              <p className="text-gray-300 text-sm">
                {new Date(item.timeStamp * 1000).toLocaleDateString()} at {new Date(item.timeStamp * 1000).toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const handleExpand = () => {
    setExpanded(!expanded);
  };

  // Get the current data for button logic
  const currentData = data && data.result && Array.isArray(data.result) ? data : dummyEtherscanData;

  return (
    <div className="flex flex-col items-center w-full px-20 bg-black py-12">
      {/* Preview Banner */}
      {isUsingDummyData && (
        <div className="w-full max-w-6xl mb-6 p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
          <div className="text-center">
            <h2 className="text-white text-xl font-bold mb-2">
              📊 Transaction Preview
            </h2>
            <p className="text-blue-100 text-sm">
              {!currentAccount 
                ? "Connect your wallet to view real transactions" 
                : isLoadingReal 
                  ? "Loading real data... Showing sample data meanwhile"
                  : "Showing sample data - Connect to Sepolia network for live data"
              }
            </p>
          </div>
        </div>
      )}

      {/* Transactions Header */}
      <div className="w-full max-w-6xl mb-6">
        <h1 className="text-white text-3xl font-bold text-center mb-2">
          Recent Transactions
        </h1>
        <p className="text-gray-400 text-center">
          {isUsingDummyData ? "Sample transaction history" : "Your transaction history"}
        </p>
      </div>

      {/* Transactions Grid */}
      {renderTransactions()}
      
      {/* Expand/Collapse Button */}
      {currentData.result.length > 6 && (
        <button
          className="mt-6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
          onClick={handleExpand}
        >
          {expanded ? "Show Less" : `Show More (${currentData.result.length - 6} more)`}
        </button>
      )}
    </div>
  );
}

export default MyComponent;