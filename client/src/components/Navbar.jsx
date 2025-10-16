import React, { useContext } from "react";
import { HiMenuAlt4 } from "react-icons/hi";
import { AiOutlineClose } from "react-icons/ai";

import logo from "../../images/xcrypt_logo.png";

//signout
import {  signOut } from "firebase/auth";
import {auth} from '../firebase';
import { useNavigate } from 'react-router-dom';
import { TransactionContext } from "../context/TransactionContext";



const NavBarItem = ({ title, classprops }) => (
  <li className={`mx-4 cursor-pointer ${classprops}`}>{title}</li>
);

const Navbar = () => {
  const [toggleMenu, setToggleMenu] = React.useState(false);
  
  // Add error boundary for context
  let contextValues;
  try {
    contextValues = useContext(TransactionContext);
  } catch (error) {
    console.error("Error accessing TransactionContext:", error);
    contextValues = {
      connectWallet: () => {},
      currentAccount: "",
      isLoading: false,
      error: "Context error",
      isMetaMaskInstalled: false
    };
  }
  
  const { connectWallet, currentAccount, isLoading, error, isMetaMaskInstalled } = contextValues;

  //signout
  const navigate = useNavigate();
 
  const handleLogout = () => {               
      signOut(auth).then(() => {
      // Sign-out successful.
          navigate("/login");
          console.log("Signed out successfully")
      }).catch((error) => {
      // An error happened.
      });
  }

  //open metamask wallet using context
  const handleWalletConnection = () => {
    if (!isMetaMaskInstalled) {
      alert("MetaMask is not installed. Please install MetaMask extension from https://metamask.io/");
      return;
    }
    connectWallet();
  };

  return (
    <nav className="w-full flex md:justify-center justify-between items-center p-4">
    <div className="md:flex-[0.9] flex-initial justify-center items-center">
      <img src={logo} alt="logo" className="w-32 cursor-pointer" />
    </div>
    <ul className="text-white md:flex hidden list-none flex-row justify-between items-center flex-initial">
      {/* {["Market", "Exchange", "Tutorials", "Wallets"].map((item, index) => (
        <NavBarItem key={item + index} title={item} />
      ))} */}

      {/* <button >Market</button>

      <button>Exchange</button>

      <button>Tutorial</button> */}
  {/* //metamask wallet open  */}
  {/* <button onClick={openMetaMask} className="my-2">Wallets</button> */}

{/* Signout Button */}
<button onClick={handleLogout} className="my-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition duration-300 ease-in-out">
  Logout
</button>

    </ul>
    
    <div className="flex relative">
      {!toggleMenu && (
        <HiMenuAlt4 fontSize={28} className="text-white md:hidden cursor-pointer" onClick={() => setToggleMenu(true)} />
      )}
      {toggleMenu && (
        <AiOutlineClose fontSize={28} className="text-white md:hidden cursor-pointer" onClick={() => setToggleMenu(false)} />
      )}
      {toggleMenu && (
        <ul
          className="z-10 fixed -top-0 -right-2 p-3 w-[70vw] h-screen shadow-2xl md:hidden list-none
          flex flex-col justify-start items-end rounded-md blue-glassmorphism text-white animate-slide-in"
        >
          <li className="text-xl w-full my-2"><AiOutlineClose onClick={() => setToggleMenu(false)} /></li>
          {/* {["Market", "Exchange", "Tutorials", "Wallets"].map(
            (item, index) => <NavBarItem key={item + index} title={item} classprops="my-2 text-lg" />,
          )} */}

           {/* MetaMask wallet connection */}
      <button 
        onClick={handleWalletConnection}
        disabled={isLoading}
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
      >
        {isLoading ? "Connecting..." : currentAccount ? `${currentAccount.slice(0,6)}...${currentAccount.slice(-4)}` : "Connect Wallet"}
      </button>
      
      {error && (
        <div className="text-red-500 text-sm mt-2 max-w-xs">
          {error}
        </div>
      )}

          {/* Signout Button */}
          <button onClick={handleLogout}>
                        Logout
                    </button>
        </ul>
      )}
    </div>
  </nav>
  );
};

export default Navbar;