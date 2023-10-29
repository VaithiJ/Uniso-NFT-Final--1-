import React, { Fragment, useState, useEffect, useRef } from "react";
import Head from "./Head";
import Swal from "sweetalert2";
import { useWeb3 } from "@3rdweb/hooks";
import "./Portfolio.css";
import { ethers } from 'ethers';
import { create } from 'ipfs-http-client';
import Share from "./Share";


var canvas = document.createElement("canvas");
var width = (canvas.width = window.innerWidth * 0.75);
var height = (canvas.height = window.innerHeight * 0.75);
var gl = canvas.getContext("webgl");

var mouse = { x: 0, y: 0 };

var numMetaballs = 10;
var metaballs = [];

for (var i = 0; i < numMetaballs; i++) {
  var radius = Math.random() * 60 + 10;
  metaballs.push({
    x: Math.random() * (width - 2 * radius) + radius,
    y: Math.random() * (height - 2 * radius) + radius,
    vx: (Math.random() - 0.5) * 3,
    vy: (Math.random() - 0.5) * 3,
    r: radius * 0.75,
  });
}

var vertexShaderSrc = `
attribute vec2 position;

void main() {
// position specifies only x and y.
// We set z to be 0.0, and w to be 1.0
gl_Position = vec4(position, 0.0, 1.0);
}
`;

var fragmentShaderSrc =
  `
precision highp float;

const float WIDTH = ` +
  (width >> 0) +
  `.0;
const float HEIGHT = ` +
  (height >> 0) +
  `.0;

uniform vec3 metaballs[` +
  numMetaballs +
  `];

void main(){
float x = gl_FragCoord.x;
float y = gl_FragCoord.y;

float sum = 0.0;
for (int i = 0; i < ` +
  numMetaballs +
  `; i++) {
vec3 metaball = metaballs[i];
float dx = metaball.x - x;
float dy = metaball.y - y;
float radius = metaball.z;

sum += (radius * radius) / (dx * dx + dy * dy);
}

if (sum >= 0.99) {
gl_FragColor = vec4(mix(vec3(x / WIDTH, y / HEIGHT, 1.0), vec3(0, 0, 0), max(0.0, 1.0 - (sum - 0.99) * 100.0)), 1.0);
return;
}

gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
}

`;

var vertexShader = compileShader(vertexShaderSrc, gl.VERTEX_SHADER);
var fragmentShader = compileShader(fragmentShaderSrc, gl.FRAGMENT_SHADER);

var program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);
gl.useProgram(program);

var vertexData = new Float32Array([
  -1.0,
  1.0, // top left
  -1.0,
  -1.0, // bottom left
  1.0,
  1.0, // top right
  1.0,
  -1.0, // bottom right
]);
var vertexDataBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vertexDataBuffer);
gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.STATIC_DRAW);

var positionHandle = getAttribLocation(program, "position");
gl.enableVertexAttribArray(positionHandle);
gl.vertexAttribPointer(
  positionHandle,
  2, // position is a vec2
  gl.FLOAT, // each component is a float
  gl.FALSE, // don't normalize values
  2 * 4, // two 4 byte float components per vertex
  0 // offset into each span of vertex data
);

var metaballsHandle = getUniformLocation(program, "metaballs");

loop();
function loop() {
  for (var i = 0; i < numMetaballs; i++) {
    var metaball = metaballs[i];
    metaball.x += metaball.vx;
    metaball.y += metaball.vy;

    if (metaball.x < metaball.r || metaball.x > width - metaball.r)
      metaball.vx *= -1;
    if (metaball.y < metaball.r || metaball.y > height - metaball.r)
      metaball.vy *= -1;
  }

  var dataToSendToGPU = new Float32Array(3 * numMetaballs);
  for (var i = 0; i < numMetaballs; i++) {
    var baseIndex = 3 * i;
    var mb = metaballs[i];
    dataToSendToGPU[baseIndex + 0] = mb.x;
    dataToSendToGPU[baseIndex + 1] = mb.y;
    dataToSendToGPU[baseIndex + 2] = mb.r;
  }
  gl.uniform3fv(metaballsHandle, dataToSendToGPU);

  //Draw
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

  requestAnimationFrame(loop);
}

function compileShader(shaderSource, shaderType) {
  var shader = gl.createShader(shaderType);
  gl.shaderSource(shader, shaderSource);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw "Shader compile failed with: " + gl.getShaderInfoLog(shader);
  }

  return shader;
}

function getUniformLocation(program, name) {
  var uniformLocation = gl.getUniformLocation(program, name);
  if (uniformLocation === -1) {
    throw "Can not find uniform " + name + ".";
  }
  return uniformLocation;
}

function getAttribLocation(program, name) {
  var attributeLocation = gl.getAttribLocation(program, name);
  if (attributeLocation === -1) {
    throw "Can not find attribute " + name + ".";
  }
  return attributeLocation;
}

canvas.onmousemove = function (e) {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
};






















const ipfs = create({ host: 'ipfs.io', port: 443, protocol: 'https' });



function Portfolio() {
  const contractABI = ["function getTokenCIDBySigner(address) public view returns (string memory)"];
  const contractAddress = '0xc40d3f0Dbd02775897Ccc6f09D62288be7aa4A91';
  const [ownerAddress, setOwnerAddress] = useState(null);
  const { address, chainId, connectWallet } = useWeb3();
  const [signerr, setSigner] = useState("")
  const [nftcontract, setNFTContract] = useState(null);
  const [image, setImage] = useState('');
  const [details, setDetails] = useState('');
  const [copied, setCopied] = useState(false);


const [url, setUrl] = useState("");
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

  const connectToNFTContract = async () => {
    try {
      const jsonResponseArray = []; // Initialize the array

      // Connect to an Ethereum provider (e.g., Metamask or a custom provider)
      const provider = new ethers.BrowserProvider(ethereum);
      // Request access to the user's Ethereum wallet
      const signer = await provider.getSigner();
      setSigner(signer.address);
  
      // Create a contract instance
      const nfttcontract = new ethers.Contract(contractAddress, contractABI, signer);
      setNFTContract(nfttcontract);

      const txResponse = await nfttcontract.getTokenCIDBySigner(signer.address);
  
      // Log the transaction hash
      const ipfsURL = txResponse[0];
      setUrl(txResponse);
  
      // Fetch the content from the IPFS URL
      if (txResponse) {
        const response = await fetch(`${txResponse}`);
        if (response.ok) {
          const data = await response.json();
          jsonResponseArray.push(data);
  
  
          setDetails((jsonResponseArray[0]));
  
  
          // Access specific properties
      
          setImage((jsonResponseArray[0]).image.pinataURL)
          // Access other properties as needed
        } else {
          console.error("Error fetching JSON data from URL:", response.statusText);
        }
      }
    }catch (error) {
      console.error('Error connecting to the contract:', error);
    }
  };
  


  
  

  
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
          // Handle the disconnect action here
          // You can put your disconnection logic in this block
          // For example, disconnecting the user's wallet
          // If the user clicks "Disconnect"
          console.log("Disconnected");
        }
      });
    } else {
      // If ownerAddress doesn't exist, show the "Connect your wallet" message
      connectWallet("injected");
    }
  };

  useEffect(() => {

    // Add the canvas to the DOM when the component mounts
    document.body.appendChild(canvas);

    // Cleanup when the component unmounts
    return () => {
      document.body.removeChild(canvas);
    };
  }, []);
 
  return (
    <div>
      <div className="fixed w-full z-20 top-0 left-0">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <a href="/" className="flex items-center">
            <img
              src="../../Images/Uniso logoW.png"
              className="mr-3 w-42 h-14 sm:w-40 sm:h-14"
              alt="Flowbite Logo"
            />
          </a>
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
        </div>
      </div>

      <div className="port" id="BlureEffect">
        {ownerAddress ? (
           <div>
           <img
             className="absolute inset-0 object-cover object-center transform translate-x-[175px] translate-y-[90px] w-2/5 right-40%"
             alt="hero"
             src="../../Images/avatar.png"
           />
<img
  style={{
    width: "500px",
    height: "300px",
    position: "relative",
    left: "200px",
    transform: "rotate(-2deg)", // Tilt the image slightly
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // Apply a white shadow
    borderBottom: "2px solid white", // Add a white underline
  }}
  src={image}
  alt="Image Description"
/>
<Share url={url} />


         </div>
          
        ) : (
          // If ownerAddress is not present, display "No identity created"
          <strong className="text-white font-extrabold">
            Please connect your wallet
          </strong>
        )}
      </div>
      
    </div>
  );
}

export default Portfolio;
