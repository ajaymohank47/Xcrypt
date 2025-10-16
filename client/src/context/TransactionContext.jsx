import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { contractABI, contractAddress } from "../utils/constants";

export const TransactionContext = React.createContext();

// Remove this line - we'll check for ethereum in each function

const createEthereumContract = () => {
  if (!window.ethereum) {
    throw new Error("MetaMask is not installed");
  }
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const transactionsContract = new ethers.Contract(contractAddress, contractABI, signer);

  return transactionsContract;
};

export const TransactionsProvider = ({ children }) => {
  const [formData, setformData] = useState({ addressTo: "", amount: "", keyword: "", message: "" });
  const [currentAccount, setCurrentAccount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [transactionCount, setTransactionCount] = useState(localStorage.getItem("transactionCount"));
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState("");
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false);
  
  const [data, setData] = useState(""); // Add this line to your state

  // Dummy transactions for preview
  const dummyTransactions = [
    {
      addressTo: "0x742d35Cc6634C0532925a3b8D4C9db96590c6C87",
      addressFrom: "0x8ba1f109551bD432803012645Hac136c22C177ec",
      timestamp: new Date(Date.now() - 86400000).toLocaleString(), // 1 day ago
      message: "Payment for services",
      keyword: "payment",
      amount: 0.5
    },
    {
      addressTo: "0x1234567890123456789012345678901234567890",
      addressFrom: "0x0987654321098765432109876543210987654321",
      timestamp: new Date(Date.now() - 172800000).toLocaleString(), // 2 days ago
      message: "NFT purchase",
      keyword: "nft",
      amount: 1.2
    },
    {
      addressTo: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
      addressFrom: "0x1111222233334444555566667777888899990000",
      timestamp: new Date(Date.now() - 259200000).toLocaleString(), // 3 days ago
      message: "DeFi investment",
      keyword: "defi",
      amount: 2.8
    },
    {
      addressTo: "0x9876543210987654321098765432109876543210",
      addressFrom: "0xfedcbafedcbafedcbafedcbafedcbafedcbafedcba",
      timestamp: new Date(Date.now() - 345600000).toLocaleString(), // 4 days ago
      message: "Token swap",
      keyword: "swap",
      amount: 0.75
    },
    {
      addressTo: "0x5555666677778888999900001111222233334444",
      addressFrom: "0xaaaaaabbbbbbccccccddddddeeeeeeffffffffff",
      timestamp: new Date(Date.now() - 432000000).toLocaleString(), // 5 days ago
      message: "Staking rewards",
      keyword: "staking",
      amount: 3.5
    },
    {
      addressTo: "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b",
      addressFrom: "0xf0e1d2c3b4a59687f0e1d2c3b4a59687f0e1d2c3",
      timestamp: new Date(Date.now() - 518400000).toLocaleString(), // 6 days ago
      message: "Liquidity provision",
      keyword: "liquidity",
      amount: 1.8
    }
  ];

  // Check if MetaMask is installed
  useEffect(() => {
    const checkMetaMask = () => {
      if (typeof window.ethereum !== 'undefined') {
        setIsMetaMaskInstalled(true);
      } else {
        setIsMetaMaskInstalled(false);
        setError("MetaMask is not installed. Please install MetaMask to use this feature.");
      }
    };
    
    checkMetaMask();
  }, []);

  const handleChange = (e, name, additionalData) => {
    if (name === "addressTo") {
      setformData((prevState) => ({ ...prevState, [name]: additionalData }));
    } else {
      setformData((prevState) => ({ ...prevState, [name]: e.target.value }));
    }
  };


  const getAllTransactions = async () => {
    try {
      if (!window.ethereum) {
        console.log("Ethereum is not present - using dummy data");
        setTransactions(dummyTransactions);
        return;
      }

      const transactionsContract = createEthereumContract();
      const availableTransactions = await transactionsContract.getAllTransactions();

      const structuredTransactions = availableTransactions.map((transaction) => ({
        addressTo: transaction.receiver,
        addressFrom: transaction.sender,
        timestamp: new Date(transaction.timestamp.toNumber() * 1000).toLocaleString(),
        message: transaction.message,
        keyword: transaction.keyword,
        amount: parseInt(transaction.amount._hex) / (10 ** 18)
      }));

      console.log("Real transactions loaded:", structuredTransactions);
      setTransactions(structuredTransactions);
      
    } catch (error) {
      console.error("Error getting transactions:", error);
      
      if (error.code === 'CALL_EXCEPTION') {
        console.log("Contract not deployed - using dummy transactions for preview");
        setTransactions(dummyTransactions);
        setError(""); // Clear error since we're showing dummy data
      } else {
        console.log("Network error - using dummy transactions for preview");
        setTransactions(dummyTransactions);
        setError(""); // Clear error since we're showing dummy data
      }
    }
  };

  const checkIfWalletIsConnect = async () => {
    try {
      if (!window.ethereum) {
        console.log("MetaMask not installed");
        return;
      }

      const accounts = await window.ethereum.request({ method: "eth_accounts" });

      if (accounts.length) {
        setCurrentAccount(accounts[0]);
        // Only try to get transactions if we have a valid account
        try {
          await getAllTransactions();
        } catch (error) {
          console.error("Error loading transactions:", error);
          // Don't crash the app if transactions fail to load
        }
      } else {
        console.log("No accounts found");
      }
    } catch (error) {
      console.error("Error checking wallet connection:", error);
      setError("Failed to check wallet connection.");
    }
  };

  const checkIfTransactionsExists = async () => {
    try {
      if (!window.ethereum) {
        return;
      }

      const transactionsContract = createEthereumContract();
      const currentTransactionCount = await transactionsContract.getTransactionCount();

      window.localStorage.setItem("transactionCount", currentTransactionCount);
      setTransactionCount(currentTransactionCount.toNumber());
      
    } catch (error) {
      console.error("Error checking transactions:", error);
      
      if (error.code === 'CALL_EXCEPTION') {
        console.log("Contract not deployed on this network");
        // Don't set error for this, as it's expected if contract isn't deployed
      } else {
        setError("Failed to check transaction count.");
      }
    }
  };

  const connectWallet = async () => {
    try {
      setError("");
      
      if (!window.ethereum) {
        setError("MetaMask is not installed. Please install MetaMask extension.");
        return;
      }

      setIsLoading(true);
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });

      if (accounts.length > 0) {
        setCurrentAccount(accounts[0]);
        setError("");
        // Try to get transactions but don't crash if it fails
        try {
          await getAllTransactions();
        } catch (transactionError) {
          console.error("Error loading transactions after connection:", transactionError);
          // Don't set error here as wallet connection was successful
        }
      } else {
        setError("No accounts found. Please check your MetaMask connection.");
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
      
      if (error.code === 4001) {
        setError("Connection rejected. Please approve the connection in MetaMask.");
      } else if (error.code === -32002) {
        setError("Connection request already pending. Please check MetaMask.");
      } else {
        setError("Failed to connect wallet. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const sendTransaction = async () => {
    try {
      if (window.ethereum) {
        const { addressTo, amount, keyword, message } = formData;
        const transactionsContract = createEthereumContract();
        const parsedAmount = ethers.utils.parseEther(amount);

        await window.ethereum.request({
          method: "eth_sendTransaction",
          params: [{
            from: currentAccount,
            to: addressTo,
            gas: "0x5208", //denomination of eth 21000 GWEI
            value: parsedAmount._hex,
          }],
        });

        const transactionHash = await transactionsContract.addToBlockchain(addressTo, parsedAmount, message, keyword);

        setIsLoading(true);
        console.log(`Loading - ${transactionHash.hash}`);
        await transactionHash.wait();
        console.log(`Success - ${transactionHash.hash}`);
        setIsLoading(false);

        const transactionsCount = await transactionsContract.getTransactionCount();

        setTransactionCount(transactionsCount.toNumber());
        window.location.reload();
      } else {
        console.log("No ethereum object");
      }
    } catch (error) {
      console.log(error);

      throw new Error("No ethereum object");
    }
  };

  useEffect(() => {
    const initializeWallet = async () => {
      try {
        await checkIfWalletIsConnect();
        await checkIfTransactionsExists();
      } catch (error) {
        console.error("Error initializing wallet:", error);
        // Don't crash the app, just log the error
      }
    };

    initializeWallet();
  }, []); // Remove transactionCount dependency to prevent infinite loops

  return (
    <TransactionContext.Provider
      value={{
        transactionCount,
        connectWallet,
        transactions,
        currentAccount,
        isLoading,
        sendTransaction,
        handleChange,
        formData,
        error,
        isMetaMaskInstalled,
        setError,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};