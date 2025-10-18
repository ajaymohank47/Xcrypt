import React, { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";

const ETHPriceConverter = () => {
  const [ethPriceInUSD, setEthPriceInUSD] = useState(null);
  const [ethPriceInINR, setEthPriceInINR] = useState(null);
  const [ethAmount, setEthAmount] = useState(1); // Initial ETH amount
  const { colors } = useTheme();

  useEffect(() => {
    const fetchEthPrice = async () => {
      try {
        const response = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd,inr");
        const data = await response.json();
        setEthPriceInUSD(data.ethereum.usd);
        setEthPriceInINR(data.ethereum.inr);
      } catch (error) {
        console.error("Error fetching Ethereum price:", error);
        // Handle errors gracefully (e.g., display an error message)
      }
    };

    fetchEthPrice();
  }, []); // Empty dependency array to fetch price only once on component mount

  const handleEthAmountChange = (event) => {
    const newEthAmount = parseFloat(event.target.value);
    if (isNaN(newEthAmount) || newEthAmount < 0) {
      setEthAmount(0); // Handle invalid or negative input
    } else {
      setEthAmount(newEthAmount);
    }
  };

  const convertEthToCurrency = (currency) => {
    if (!ethPriceInUSD || !ethPriceInINR) {
      return "Fetching price...";
    }
    const price = currency === "USD" ? ethPriceInUSD : ethPriceInINR;
    return (ethAmount * price).toFixed(2);
  };

  return (
    <div className={`eth-price-converter ${colors.card} shadow-lg px-8 py-6 flex flex-col items-center rounded-xl mx-4 my-8`}>
      <h2 className={`${colors.textPrimary} text-2xl font-bold mb-6 text-center`}>
        💰 ETH Price Converter
      </h2>

      <div className="flex items-center space-x-4 mb-6">
        <div className="flex flex-col">
          <label className={`${colors.textMuted} text-sm mb-2`}>ETH Amount</label>
          <input
            type="number"
            min="0"
            step="0.01"
            placeholder="Enter ETH amount"
            className={`w-40 px-4 py-3 ${colors.input} ${colors.inputFocus} rounded-lg ${colors.textPrimary} placeholder-gray-400 transition-all duration-200`}
            value={ethAmount}
            onChange={handleEthAmountChange}
          />
        </div>

        <div className="flex flex-col">
          <label className={`${colors.textMuted} text-sm mb-2`}>Currency</label>
          <select
            className={`${colors.textPrimary} ${colors.input} px-4 py-3 ${colors.inputFocus} rounded-lg cursor-pointer transition-all duration-200`}
            onChange={(event) => convertEthToCurrency(event.target.value)}
          >
            <option value="USD">USD ($)</option>
            <option value="INR">INR (₹)</option>
          </select>
        </div>
      </div>

      <div className={`${colors.card} ${colors.border} border rounded-lg p-4 w-full max-w-md`}>
        {convertEthToCurrency("USD") !== "Fetching price..." ? (
          <div className="text-center">
            <p className={`${colors.textPrimary} text-lg font-semibold mb-2`}>
              {ethAmount} ETH equals:
            </p>
            <p className="text-green-600 font-bold text-xl mb-1">
              ${convertEthToCurrency("USD")} USD
            </p>
            <p className="text-blue-600 font-bold text-xl">
              ₹{convertEthToCurrency("INR")} INR
            </p>
          </div>
        ) : (
          <div className="text-center">
            <div className="animate-pulse">
              <div className={`${colors.tertiary} h-4 rounded mb-2`}></div>
              <div className={`${colors.tertiary} h-6 rounded mb-1`}></div>
              <div className={`${colors.tertiary} h-6 rounded`}></div>
            </div>
            <p className={`${colors.textMuted} mt-2`}>Fetching Ethereum price...</p>
          </div>
        )}
      </div>

      <p className={`${colors.textMuted} text-xs mt-4 text-center`}>
        Prices updated in real-time via CoinGecko API
      </p>
    </div>
  );
};

export default ETHPriceConverter;