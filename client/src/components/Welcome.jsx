import { useContext, useState, useEffect } from "react";
import { AiFillPlayCircle } from "react-icons/ai";
import { SiEthereum } from "react-icons/si";
import { BsInfoCircle } from "react-icons/bs";
import QRCode from "qrcode.react";
import logo from "../../images/xcrypt_logo.png";
import { QrReader } from 'react-qr-reader';

import { TransactionContext } from "../context/TransactionContext";
import { shortenAddress } from "../utils/shortenAddress";
import { Loader } from ".";

const Input = ({ placeholder, name, type, value, handleChange }) => (
  <input
    placeholder={placeholder}
    type={type}
    step="0.0001"
    value={value}
    onChange={(e) => handleChange(e, name)}
    className="my-2 w-full bg-slate-800/40 backdrop-blur-sm border border-slate-600/50 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500/50 transition-all duration-300 text-sm"
  />
);

const Welcome = () => {
  const { currentAccount, connectWallet, handleChange, sendTransaction, formData, isLoading } = useContext(TransactionContext);

  const [qrCodeData, setQrCodeData] = useState("");
  const [selected, setSelected] = useState("environment");
  const [startScan, setStartScan] = useState(false);
  const [loadingScan, setLoadingScan] = useState(false);
  const [data, setData] = useState("");

  const handleScan = async (scanData) => {
    setLoadingScan(true);
    console.log(`dataobject`, scanData);
    if (scanData && scanData !== "") {
      setData(scanData.text);
      setStartScan(false);
      setLoadingScan(false);

      // Use scanData.text directly
      handleChange(null, "addressTo", scanData.text);
      console.log(typeof (scanData.text));
      console.log(data);
    }
  };

  const handleError = (err) => {
    console.error(err);
  };


  useEffect(() => {
    // Generate the QR code data from the current account
    setQrCodeData(currentAccount || "");
  }, [currentAccount]);


  const handleSubmit = (e) => {
    const { amount, keyword, message } = formData;
    const addressTo = data;

    e.preventDefault();

    if (!addressTo || !amount || !keyword || !message) return;
    sendTransaction();
  };


  return (
    <div className="flex w-full justify-center items-center">
      <div className="flex flex-col md:flex-row items-start justify-between md:p-20 py-12 px-4 w-full">
        <div className="flex flex-1 justify-start items-start flex-col md:mr-8 ">
          <div className="p-3 flex justify-end items-start flex-col rounded-xl h-80 sm:w-72 w-full card bg-opacity-10 backdrop-blur-md backdrop-brightness-125 border-white-600 md:ml-20 blue-glassmorphism">
            <div className="flex justify-between flex-col w-full h-full ">
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 rounded-full border-2 border-white flex justify-center items-center">
                  <SiEthereum fontSize={21} color="#fff" />
                </div>
                <BsInfoCircle fontSize={17} color="#fff" />
              </div>
              <div>
                <p className="text-white font-light text-sm">
                  {shortenAddress(currentAccount)}
                </p>
                <p className="text-white font-semibold text-lg mt-1 text-center">
                  Ethereum
                </p>
              </div>
            </div>

            <div className="w-full h-40 mt-4 flex flex-col justify-center items-center">
              <QRCode value={qrCodeData} />
              <div>

                {!currentAccount && (
                  <button
                    type="button"
                    onClick={connectWallet}
                    className="flex flex-row justify-center items-center my-10 bg-[#2952e3] p-3 rounded-full cursor-pointer hover:bg-[#2546bd] bg-gradient-to-r from-orange-400 to-blue-500 hover:from-pink-500 hover:to-yellow-500 w-4.5"
                  >
                    <AiFillPlayCircle className="text-white mr-2" />
                    <p className="text-white text-xl font-semibold">
                      Connect Wallet
                    </p>
                  </button>
                )}

              </div>
            </div>
          </div>

        </div>


        <div className="flex flex-1 justify-start items-start flex-col md:mr-8">
          <div className="p-3 flex  items-start flex-col rounded-xl h-80 sm:w-72 w-full card bg-opacity-10 backdrop-blur-md backdrop-brightness-125 border-red-600 md:ml-20">
            <div className="flex justify-between flex-col w-full h-full">

              <button
                onClick={() => {
                  setStartScan(!startScan);
                }}
                className="text-white w-full mt-2 border-[1px] p-3 border-[#3d4f7c] hover:bg-[#3d4f7c] rounded-full cursor-pointer bg-gradient-to-r from-orange-400 to-blue-500 hover:from-pink-500 hover:to-yellow-500"
              >
                {startScan ? "Stop Scan" : "Start Scan"}
              </button>
              <div className="md:flex-[0.9] flex-initial justify-center -ml-3.5 items-center mt-24 w-[900px] h-[500px]">
                <a href=""> <img src={logo} alt="logo" className=" cursor-pointer " /></a>
              </div>

              {startScan && (
                <>
                  <select
                    onChange={(e) => setSelected(e.target.value)}
                    className="text-white w-full mt-2 border-[1px] p-2 border-[#3d4f7c] hover:bg-[#3d4f7c] rounded-full cursor-pointer"
                  >
                    <option value={"environment"}>Back Camera</option>
                    <option value={"user"}>Front Camera</option>
                  </select>

                  <QrReader
                    facingMode={selected}
                    delay={1000}
                    onError={handleError}
                    onResult={handleScan}
                    style={{ width: "100%", marginTop: "10px" }}
                  />
                </>
              )}
              {loadingScan && <p>Loading</p>}

            </div>

          </div>

        </div>




        <div className="flex flex-col flex-1 items-center justify-start w-full md:mt-0 mt-10 md:ml-50">
          <div className="p-5 sm:w-96 w-full h-80 bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-2xl flex flex-col">
            <Input
              placeholder="Address To"
              name="addressTo"
              type="text"
              value={formData.addressTo}
              handleChange={handleChange}
            />

            <Input
              placeholder="Amount (ETH)"
              name="amount"
              type="number"
              value={formData.amount}
              handleChange={handleChange}
            />

            <Input
              placeholder="Name"
              name="keyword"
              type="text"
              value={formData.keyword}
              handleChange={handleChange}
            />

            <textarea
              placeholder="Enter Message"
              name="message"
              value={formData.message}
              onChange={(e) => handleChange(e, "message")}
              rows={2}
              className="my-2 w-full bg-slate-800/40 backdrop-blur-sm border border-slate-600/50 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500/50 transition-all duration-300 resize-none text-sm"
            />

            <div className="h-[1px] w-full bg-slate-600/50 my-2" />

            {isLoading ? (
              <Loader />
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg text-sm mt-auto"
                disabled={!formData.addressTo || !formData.amount || !formData.keyword || !formData.message}
              >
                Send now
              </button>
            )}
          </div>
        </div>
      </div>
    </div>

  );
};

export default Welcome;