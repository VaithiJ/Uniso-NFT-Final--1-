import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { BsFillShieldLockFill, BsTelephoneFill } from "react-icons/bs";
import { CgSpinner } from "react-icons/cg";
import OtpInput from "otp-input-react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { auth } from "../firebase.config";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { toast, Toaster } from "react-hot-toast";
import { fabric } from 'fabric';
import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas';
import Swal from "sweetalert2";
import { useWeb3 } from "@3rdweb/hooks";
import { ethers } from 'ethers';
import { uploadJSONToIPFS, uploadFileToIPFS } from "./Ipfs";
import LoadN from "./LoadN";
import { useNavigate } from "react-router-dom";


import axios from 'axios';
import { parse } from "@fortawesome/fontawesome-svg-core";


function Steps() {
  const navigate = useNavigate();

  const erc20Address = '0x239579dacc83217dd6EFEB69567177100e932aB6';
  const ercabi = ["function sendToDeployer() public payable"]
  const contractABI = ["function mintNFT(address _to, string memory _tokenCID) public"]
  const contractAddress = '0x0eB18e650E0363011eE94E4Be9952B5C53e2d90B';
  const [contract, setContract] = useState(null);
  const [nftcontract, setNFTContract] = useState(null);
  const [nftsigner, setNftsign] = useState('');



  const [currentStep, setCurrentStep] = useState(1);
  const [otp, setOtp] = useState("");
  const [ph, setPh] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [user, setUser] = useState(null);
  const [numberVerified, setNumberVerified] = useState(false);
  const [error, setError] = useState("");
  const [isCameraOpen, setCameraOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    dob: "",
    panCard: "",
    aadharCard: ""
  });
  const [image, setImage] = useState(null);

  const [cid, setCID] = useState('');

  const videoRef = useRef(null);

  const [cameraAccess, setCameraAccess] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const canvasRef = useRef(null);
  const [FirstName, setFirstName] = useState('');
  const [LastName, setLastName] = useState('');
  // const [email, setemail] = useState('');
  // const [phoneNumber, setphoneNumber] = useState('');
  const [dob, setdob] = useState('');
  const [panCard, setPanCard] = useState('');
  // const [aadharCard, setaadharCard] = useState('');
  const [nameBottom, setNameBottom] = useState('');
  const [Gender, setGender] = useState('Male');
  const [popupClosed, setPopupClosed] = useState(false);
  const [hash, setHash] = useState(false);
  const [hash2, setHash2] = useState(false);
  const [signner, setsiggn] = useState('');
  const [success, setSuccess] = useState(false);
  const [success2, setSuccess2] = useState(false);
  const [loading2, setLoading2] = useState(false);

  const connectToContract = async () => {
    try {
      // Connect to an Ethereum provider (e.g., Metamask or a custom provider)
      const provider = new ethers.BrowserProvider(ethereum);
      // Request access to the user's Ethereum wallet
const signer = await provider.getSigner();
setsiggn(signer.address);
      // Create a contract instance
      const contract = new ethers.Contract(erc20Address, ercabi, signer);
      setContract(contract);
    } catch (error) {
      console.error('Error connecting to the contract:', error);
    }
  };

  const connectToNFTContract = async () => {
    try {
      // Connect to an Ethereum provider (e.g., Metamask or a custom provider)
      const provider = new ethers.BrowserProvider(ethereum);
      // Request access to the user's Ethereum wallet
const signer = await provider.getSigner();
setNftsign(signer);
      // Create a contract instance
      const nfttcontract = new ethers.Contract(contractAddress, contractABI, signer);
      setNFTContract(nfttcontract);
    } catch (error) {
      console.error('Error connecting to the contract:', error);
    }
  };

  async function readFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => resolve(event.target.result);
        reader.onerror = (error) => reject(error);
        reader.readAsArrayBuffer(file);
    });
}

const fetchDataFromIPFS = async (cid) => {
  try {
      const response = await axios.get(cid);
      return response.data;
  } catch (error) {
      console.error('Error fetching data from IPFS:', error);
      return null;
  }
};


const subscribe = async () => {
  try {
    if (contract) {
      setLoading(true); // Set loading state to true

      // Call a function on the contract
      const txResponse = await contract.sendToDeployer({ value: ethers.parseEther("5") });
  
  
      // Wait for the transaction to be mined
      const txReceipt = await txResponse.wait();
  
  
      // Log the transaction hash
      setSuccess(true);
      setHash(true);
    }
  } catch (error) {
    console.error('Error calling the contract function:', error);
  } finally {
    setLoading(false); // Set loading state to false when done
  }
};
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCameraToggle = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      // Access to camera granted
      setCameraAccess(true);
      setShowPopup(true);
      setPopupClosed(false);
      const videoElement = document.getElementById("camera-feed");
      videoElement.srcObject = stream;
      setTimeout(() => {
        handleClosePopup();
        setPopupClosed(true);
      }, 5000);
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  const handleClosePopup = () => {
    if (cameraStream) {
      const tracks = cameraStream.getTracks();
      tracks.forEach((track) => {
        track.stop();
      });
    }
    setShowPopup(false);
  };

  // const handleClosePopup = () => {
  //   setShowPopup(false);
  // };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
  };

  const nextStep = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };




  const handleFormSubmit = async (e) => {
    e.preventDefault();
  
    // Create a JSON object with the form data
    const userData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      dob: formData.dob,
      panCard: formData.panCard, // Corrected key name
      aadharCard: formData.AadharNumber, // Corrected key name
    };

    try {
      // Upload the JSON data to Pinata IPFS
      const jsonResult = await uploadJSONToIPFS(userData);
  
      // Set the CID in the state
      setCID(jsonResult);
  
      // Store the CID in local storage
      localStorage.setItem('pinataCID', jsonResult.pinataURL);
      setCurrentStep((prevStep) => prevStep + 1);
    } catch (error) {
      console.error('Error pinning details to IPFS:', error);
    }
  };
  

  const previousStep = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  // Calculate the progress as a percentage
  const progress = (currentStep / 4) * 100;

  const isLastStep = currentStep === 4;
  const containerStyle = {
    width: "80%",
    height: "80%",
    margin: "0 auto",
    marginTop: "-70px", // Center the content horizontally
  };

  function onCaptchVerify() {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        "recaptcha-container",
        {
          size: "invisible",
          callback: (response) => {
            onSignup();
          },
          "expired-callback": () => { },
        },
        auth
      );
    }
  }

  function onSignup() {

    setLoading(true);
    onCaptchVerify();

    const formatPh = "+" + ph;

    if (window.recaptchaVerifier) {
      signInWithPhoneNumber(auth, formatPh, window.recaptchaVerifier)
        .then((confirmationResult) => {
          window.confirmationResult = confirmationResult;
          setLoading(false);
          setShowOTP(true);
          toast.success("OTP sent successfully!");

        })
        .catch((error) => {
          console.log(error);
          setLoading(false);
        });
    } else {
      console.error("recaptchaVerifier not properly initialized");
    }
  }

  function onOTPVerify() {

    setLoading(true);
    window.confirmationResult
      .confirm(otp)
      .then(async (res) => {
        setUser(res.user);
        setLoading(false);
        // Set the numberVerified state to true
        setNumberVerified(true);

        setError("");
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        setError("Incorrect OTP, please enter the correct OTP");
        setTimeout(() => {
          setError("");
        }, 3000);
      });
  }

  useEffect(() => {
    if (numberVerified) {
      // Automatically proceed to the next step after number verification
      if (currentStep === 1) {
        nextStep();

      }
    }
  }, [numberVerified, currentStep]);

  //NFT ID card code

  const handlefirstName = (e) => {
    setFirstName(e.target.value);
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handlelastName = (e) => {
    setLastName(e.target.value);
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const handleDOB = (e) => {
    setdob(e.target.value);
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  }
  const handleGender = (e) => {
    setGender(e.target.value);
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const captureElementAsFile = async () => {
    try {
      const mmElement = document.getElementById('NFTCard'); // Get the element you want to capture
  
      // Use html2canvas to capture the element as an image with higher DPI
      const canvas = await html2canvas(mmElement, { dpi: 300, scale: 2 });
  
      // Convert the canvas to a Blob (File-like object)
      const blob = await new Promise((resolve, reject) => {
        canvas.toBlob(resolve, 'image/png', 1.0);
      });
  
      // Create a File object from the Blob
      const file = new File([blob], `${FirstName || 'Empty'} IDcard.png`, { type: 'image/png' });
  
      // Set the file in your component's state
      setImage(file);
  
      // Upload the selected image to IPFS and get the IPFS hash
      const imageBuffer = await readFile(file);
      const imageCID = await uploadFileToIPFS(file);
  
      // Retrieve the JSON data CID from local storage
      const existingCID = localStorage.getItem('pinataCID');
      const jsonData = await fetchDataFromIPFS(existingCID);
  
      // Fetch the JSON data from IPFS using the JSON CID
  
      if (jsonData) {
        // Update the JSON data with the image CID
        jsonData.image = imageCID;
  
        // Upload the updated JSON data to IPFS
        const updatedJsonCID = await uploadJSONToIPFS(jsonData);
  
        // Update the local storage with the new JSON data CID
        const updatedJsonCIDWithGateway = (updatedJsonCID.pinataURL);
        
        // Mint the NFT with the updated JSON data CID
        const txResponse = await nftcontract.mintNFT(nftsigner, updatedJsonCIDWithGateway);
  
        // Wait for the transaction to be mined
        const txReceipt = await txResponse.wait();
  
        // Log the transaction hash
    
        setHash2(true);
      } else {
        console.error('Error fetching JSON data from IPFS');
      }
    } catch (error) {
      console.error('Transaction failed:', error);
    }
  };
  
  
  


  const handleDownloadImage = () => {
    const mmElement = document.getElementById('NFTCard'); // Get the element with ID "mm"
  
    // Use html2canvas to capture the element as an image with higher DPI
    html2canvas(mmElement, { dpi: 300, scale: 2 }).then((canvas) => {
      // Convert the canvas to a data URL
      const dataURL = canvas.toDataURL('image/png', 1.0); // Use format 'image/png' and full quality (1.0)
      const fileName = `${FirstName || 'Empty'} IDcard.png`;
      // Create a link element for downloading
      const link = document.createElement('a');
      link.href = dataURL;
      link.download = fileName;
      link.click();
    });
  };
  const [ownerAddress, setOwnerAddress] = useState(null);
  const { address, chainId, connectWallet } = useWeb3();
  useEffect(() => {

    if (address) {
      const truncatedAddress =
        address.substring(0, 6) + "..." + address.substring(address.length - 4);

      setOwnerAddress(truncatedAddress);
      // setOwnerAddress(address);
    } else {
      setOwnerAddress(null);
    }
  }, [address]);

  useEffect(() => {
    connectToContract();
  }, []);

  useEffect(() => {
    connectToNFTContract();
  }, []);
  const handleButtonClick = () => {
    if (address) {
      // If ownerAddress exists, show the address
      Swal.fire({
        title: "Your address:",
        text: address,
        icon: "info",
        showCancelButton: false, // Display the Cancel button
        confirmButtonText: "OK", // Change the text of the Confirm button to "Disconnect"
      }).then((result) => {
        if (result.isConfirmed) {
    
          console.log("Disconnected");
        }
      });
      setCurrentStep(currentStep + 1);
    } else {
      // If ownerAddress doesn't exist, show the "Connect your wallet" message
      connectWallet("injected");
    }
  };
 

  return (
    <div style={containerStyle}>
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-3xl font-semibold text-gray-800 mt-10">
        Mint your NFT
      </h2>
      <div className="text-center mt-4">
        <button
          className="w-40 h-12 text-white font-semibold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg shadow-lg hover:scale-105 duration-200 hover:cursor-pointer"
          onClick={handleButtonClick}
        >
          {ownerAddress ? (
            // If ownerAddress exists, display the address
            <>{ownerAddress}</>
          ) : (
            // If ownerAddress doesn't exist, display "Connect Wallet"
            <>Connect Wallet</>
          )}
        </button>  
          <div className="p-1 w-250 ">
            {ownerAddress && currentStep === 1 && (
              <div className="mb-4">
                {/* <h3 className="text-lg font-semibold text-gray-700">
                  Step 1: Information
                </h3> */}
                {/* <p className="text-gray-600">Enter your information.</p> */}
                <section className="mt-[-30px]  text-gray-50">
                  <div className=" mx-auto p-4 sm:p-10">
                    <div className="grid max-w-md grid-cols-1 gap-6 mx-auto auto-rows-fr lg:max-w-[90%] max-h-[400px] lg:gap-2 xl:gap-6 lg:grid-cols-1">
                
                      <div className="relative flex flex-col items-center p-8 border-2 rounded-md shadow-lg shadow-gray-500 backdrop-blur-sm    ">
                        <span className="absolute top-0 px-6 pt-1 pb-2 font-medium rounded-b-lg   bg-violet-400   text-gray-900">
                          Professional
                        </span>
                        <p className="flex items-center justify-center my-6 space-x-2 font-bold">
                          {/* <span className="text-lg line-through   text-violet-400">
                            &nbsp;32€&nbsp;
                          </span> */}
                          <span className="pb-2 text-4xl text-violet-400">
                            5 XDC
                          </span>
                          {/* <span className="text-lg text-violet-400">/mo</span> */}
                        </p>
                        <ul className="flex-1 space-y-2">
                          <li className="flex items-center space-x-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              className="w-6 h-6   text-violet-400"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                              ></path>
                            </svg>
                            <span className="text-black">Multi-platform use</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              className="w-6 h-6   text-violet-400"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                              ></path>
                            </svg>
                            <span className="text-black">Utilize the built-in generative art</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              className="w-6 h-6   text-violet-400"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                              ></path>
                            </svg>
                            <span className="text-black">Verified Soulbound NFT</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              className="w-6 h-6   text-violet-400"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                              ></path>
                            </svg>
                            <span className="text-black">
                              Sign in with XDC and more
                            </span>
                          </li>
                        </ul>
                        <button
        className="px-4 py-2 mt-4 font-semibold uppercase border rounded-lg md:mt-12 sm:py-3 sm:px-8 bg-violet-400 border-violet-400 bn632-hover bn2"
        onClick={subscribe}
        disabled={loading || success} // Disable the button when loading or after successful transaction
      >
        {loading ? 'Loading...' : success ? 'Successfully Subscribed' : 'Subscribe'}
      </button>

{loading ? <LoadN /> : null}
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            )}
            {ownerAddress && currentStep === 2 && (
              <div className="mb-9 mt-10 backdrop-blur-sm shadow-lg shadow-gray-500 rounded-md w-[1050px]">
                {/* <h3 className="text-lg font-semibold text-gray-700">
                  Step 2: Confirmation
                </h3> */}
                {/* <p className="text-gray-600">Confirm your details.</p> */}
                <form
                  onSubmit={handleSubmit}
                  className="flex justify-center items-center"
                >
                  <div className="w-1/2 p-4 space-y-4">
                    <div className="relative bottom-10">
                      <label htmlFor="firstName" className="block">
                        First Name
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={FirstName}
                        onChange={handlefirstName}
                        placeholder="First Name"
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                      />
                    </div>
                     <div className="relative bottom-10">
                      <label htmlFor="lastName" className="block">
                        Last Name
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={LastName}
                        onChange={handlelastName}
                        placeholder="Last Name"
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div className="relative bottom-10">
                      <label htmlFor="email" className="block">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={FormData.email}
                        onChange={handleChange}
                        placeholder="Email"
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div className="relative bottom-10">
                      <label htmlFor="phoneNumber" className="block">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phoneNumber"
                        name="phoneNumber"
                        value={FormData.phoneNumber}
                        onChange={handleChange}
                        placeholder="Phone Number"
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                  <div className="w-1/2 p-4 space-y-4 mt-[5px]">
                  <div className="relative bottom-10">
                      <label htmlFor="dob" className="block">
                        Date of Birth (DOB)
                      </label>
                      <input
                        type="date"
                        id="dob"
                        name="dob"
                        value={dob}
                        onChange={handleDOB}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div className="relative bottom-10">
                      <label htmlFor="phoneNumber" className="block">
                        AadharCard Number
                      </label>
                      <input
                        type="tel"
                        id="AadharNumber"
                        name="AadharNumber"
                        value={FormData.aadharCard}
                        onChange={handleChange}
                        placeholder="AadharCard Number"
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div className="relative bottom-10">
                      <label htmlFor="phoneNumber" className="block">
                        Pan Number
                      </label>
                      <input
                        type="tel"
                        id="panNumber"
                        name="panNumber"
                        value={FormData.panCard}
                        onChange={handleChange}
                        placeholder="Pan Number"
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div className="relative bottom-10">
                    <label htmlFor="phoneNumber" className="block">
                        Gender
                      </label>
                    <select
                      value={Gender}
                      onChange={handleGender}
                      className="p-2 border rounded"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                    </div>
                    <div className="relative bottom-[90px] left-7">
                      <button
                        onClick={handleCameraToggle}
                        className="flex items-center bg-violet-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-[70px] mt-[50px]"
                      >
                        <FontAwesomeIcon icon={faCamera} className="mr-2" />{" "}
                        LiveNessCheck
                        {popupClosed && (
     <div className="absolute ml-[160px] mt-[4px] text-green-500">
    <FontAwesomeIcon icon={faCheckCircle} />
    </div>)}
                      </button>
                      {showPopup && (
                        <div className="fixed inset-0 flex items-center justify-center z-50">
                          <div
                            className="absolute inset-0 bg-black opacity-10"
                            onClick={handleClosePopup}
                          ></div>
                          <div className="bg-white p-6 rounded-lg shadow-lg">
                            <h2>Camera Access Granted</h2>
                            <button
                              onClick={handleClosePopup}
                              className="close-button"
                            >
                              Close
                            </button>
                            <video id="camera-feed" autoPlay playsInline  className="w-60 h-60" style={{ objectFit: 'cover', clipPath: 'circle(50% at 50% 50%)' }}/>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div id="NFTCard" className=" bg-[#F0EFEA]  shadow-2xl  p-4 rounded-lg relative right-6 -rotate-3 w-11/12 max-w-xs md:max-w-md lg:max-w- h-20 md:h-72 lg:h-200 transform translate-x-4 transition-transform duration-500 ml-20 mr-10" style={{top:"-10px"}}>
                    <div className="flex flex-col md:flex-row h-full items-center">
                      {/* Left Column */}
                      <div className="md:w-1/2 text-black">
                        {/* Logo with effect */}
                        <div className="flex items-center mb-4 relative bottom-6">
                          <img
                            src="../../Images/Uniso.png" // Replace with the actual logo path
                            alt="DAPP Logo"
                            className=" w-32 h-12 mr-3  border-2"
                          />

                        </div>
                        {/* Name and Age */}
                        <div className="flex text-lg mb-5">
                          <div className='font-bold open-sans' >Name:</div>
                          <div className=' ml-4 Candal'> {FirstName} {LastName}</div>
                        </div>
                        {/* DOB and Gender */}
                        <div className="flex">
                          <div className='text-lg'>
                            <div className='font-bold open-sans '>DOB: </div>
                            <div className=' Montserrat '>{dob}</div>
                          </div>
                          <div className='text-lg ml-8'>
                            <div className='font-bold open-sans'>Blockchain: </div>
                            <div className='Montserrat'>XDC</div>
                          </div>
                        </div>

                      </div>
                      {/* Right Column (User Image) */}
                      <div className="md:w-1/2 flex justify-center">
                        {Gender === 'Male' && (
                          <img
                            src="../../Images/Boy.png"
                            alt="User"
                            className="w-50 h-50"
                          />
                        )}
                        {Gender === 'Female' && (
                          <img
                            src="../../Images/Girl.png"
                            alt="User"
                            className="w-50 h-50"
                          />
                        )}
                      </div>
                    </div>

                  </div>
                </form>
              </div>
            )}
            {ownerAddress && currentStep === 3 && (
              <div className="mb-4 ">
                <h3 className="text-lg font-semibold text-gray-700">
                </h3>
                <p className="text-gray-600">Submit your information.</p>
                <div>
                  <Toaster toastOptions={{ duration: 4000 }} />
                  <div id="recaptcha-container"></div>
                  {user ? (
                    <h2 className="text-center text-black font-medium text-lg relative top-4">
                      Your Number has been successfully Verified
                    </h2>
                  ) : (
                    <div className="w-80 flex flex-col gap-4 rounded-lg p-2.5 mx-auto items-center justify-center">
                      {showOTP ? (
                        <>
                          <div className="bg-black text-emerald-500 w-fit mx-auto p-4 rounded-full">
                            <BsFillShieldLockFill size={30} />
                          </div>
                          <label
                            htmlFor="otp"
                            className="font-bold text-xl text-black text-center"
                          >
                            Enter your OTP
                          </label>
                          <OtpInput
                            value={otp}
                            onChange={setOtp}
                            OTPLength={6}
                            otpType="number"
                            disabled={false}
                            separator={<span>-</span>}
                            className="outline-none"
                          />

                          <button
                            onClick={onOTPVerify}
                            className="bg-emerald-600 w-full flex gap-1 items-center justify-center py-2.5 text-white rounded"
                          >
                            {loading && (
                              <CgSpinner
                                size={20}
                                className="mt-1 animate-spin"
                              />
                            )}
                            <span>Verify OTP</span>
                          </button>
                          {error && (
                            <div className="text-red-600 text-center mt-2">
                              {error}
                            </div>
                          )}
                        </>
                      ) : (
                        <>
                          <div className="bg-white text-emerald-500 w-fit mx-auto p-4 rounded-full">
                            <BsTelephoneFill size={30} />
                          </div>
                          <label
                            htmlFor=""
                            className="font-bold text-xl text-black text-center"
                          >
                            Enter Your Aadhar-Linked Phone Number
                          </label>
                          <PhoneInput
                            country={"in"}
                            value={ph}
                            onChange={setPh}
                          />
                          <button
                            onClick={onSignup}
                            className="bg-violet-600 w-full flex gap-1 items-center justify-center py-2.5 text-white rounded"
                          >
                            {loading && (
                              <CgSpinner
                                size={20}
                                className="mt-1 animate-spin"
                              />
                            )}
                            <span>Send OTP</span>
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
            {ownerAddress && currentStep === 4 && (
              <div className="mb-14">
                <h3 className="text-lg font-semibold text-gray-700">
                </h3>
                <p className="text-gray-600 relative top-4">
                  You can mint your identity here.
                </p>
                <div id="NFTCard" className="bg-[#F0EFEA] shadow-2xl relative left-[0px] top-7 p-4 rounded-lg w-11/12 max-w-xs md:max-w-md lg:max-w-lg h-20 md:h-72 lg:h-200 transform translate-x-4 transition-transform duration-500 flex items-center justify-center">
                    <div className="flex flex-col md:flex-row h-full items-center">
                      {/* Left Column */}
                      <div className="md:w-1/2 text-black">
                        {/* Logo with effect */}
                        <div className="flex items-center mb-4 relative bottom-6">
                          <img
                            src="../../Images/Uniso.png" // Replace with the actual logo path
                            alt="DAPP Logo"
                            className=" w-32 h-12 mr-3  border-2"
                          />

                        </div>
                        {/* Name and Age */}
                        <div className="flex text-lg mb-5">
                          <div className='font-bold open-sans' >Name:</div>
                          <div className=' ml-4 Candal'> {FirstName} {LastName}</div>
                        </div>
                        {/* DOB and Gender */}
                        <div className="flex">
                          <div className='text-lg'>
                            <div className='font-bold open-sans '>DOB: </div>
                            <div className=' Montserrat '>{dob}</div>
                          </div>
                          <div className='text-lg ml-8'>
                            <div className='font-bold open-sans'>Blockchain: </div>
                            <div className='Montserrat'>XDC</div>
                          </div>
                        </div>

                      </div>
                      {/* Right Column (User Image) */}
                      <div className="md:w-1/2 flex justify-center">
                        {Gender === 'Male' && (
                          <img
                            src="../../Images/Boy.png"
                            alt="User"
                            className="w-50 h-50"
                          />
                        )}
                        {Gender === 'Female' && (
                          <img
                            src="../../Images/Girl.png"
                            alt="User"
                            className="w-50 h-50"
                          />
                        )}
                      </div>
                    </div>

                  </div>
                
                  {hash2 && (
  <div>
  <button onClick={handleDownloadImage} className="p-2 bg-green-500 text-white rounded relative top-10">
    Download ID
  </button>
  <button onClick={() => navigate("/Port")}className="p-2 bn632-hover bn24 rounded relative top-10">
    Go to App
  </button>
</div>
)}

              </div>
            )}
          </div>
          {ownerAddress && (
  <div className="relative h-4 bg-gray-300 rounded-full mt-2">
    <div
      className="absolute h-4 bg-black rounded-full"
      style={{ width: `${progress}%` }}
    ></div>
  </div>
)}
          <div className="flex justify-end mt-10">
            {currentStep > 1 && !isLastStep && (
              <button
                onClick={previousStep}
                className="px-4 py-2 text-white bg-violet-500 rounded-lg hover:bg-blue-600 mr-2 mb-5"
              >
                Previous
              </button>
            )}
           
             {ownerAddress && currentStep < 3 && hash ? (
  <button
    onClick={nextStep}
    className="px-4 py-2 text-white bg-violet-500 rounded-lg hover-bg-blue-600 mb-5"
  >
    Next
  </button>
) : null} 



            {ownerAddress && currentStep === 3 && numberVerified && (
              
              <button
                className="px-4 py-2 text-white bg-violet-500 rounded-lg hover:bg-green-600"
                onClick={handleFormSubmit}
              >
                Submit
              </button>
            )}
          </div>
          {ownerAddress && isLastStep && !hash2 && (
  <div className="flex justify-end mt-4">
     <button
     style={{position:"relative", left:"-50px", top:"-20px"}}
      className="px-4 py-2 mr-40 text-white bg-violet-500 rounded-lg hover-bg-green-600 "
      onClick={captureElementAsFile}
       disabled={loading2 || success2} 
    >
              {loading2 ? 'Loading...' : success2 ? 'Go to App' : 'Mint NFT'}

    </button>
    {loading2 ? <LoadN /> : null}


  </div>
)}

        </div>
      </div>
    </div>
  );
}

export default Steps;
