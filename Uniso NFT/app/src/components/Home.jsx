import React, { Fragment } from "react";
import { useNavigate } from "react-router-dom";
import Head from "./Head";
import Video from "./Video";
import About from "./About";

function Home() {
  const navigate = useNavigate();
  return (
    <Fragment>
      <Head />
      <section className="min-h-screen">
        <div className="grid max-w-screen-xl  px-4 py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12">
          <div className="mr-auto place-self-center lg:col-span-6">
            <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl relative font-lato tracking-wide">
              Blockchain backed identity revolution{" "}
              <span
                id="gradient-text"
                className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-blue-500 to-violet-500 font-lato tracking-wide">
                powered by XDC
              </span>
            </h1>

            <p className="max-w-2xl text-lg font-medium mb-6 font-sans  text-gray-900 lg:mb-8 md:text-lg lg:text-xl dark:text-gray-400">
            Join the digital identity revolution with UNISO, utilizing the XDC blockchain for unforgeable, transparent identities. Take control of your verified, blockchain-backed identity, and explore exclusive <strong>SOULBOUND NFTs</strong> for added uniqueness.
            </p>
            <button
              className="bn632-hover bn24"
              onClick={() => navigate("/Walletconnect")}>
              Mint Identity
            </button>
            <button className="bn11-hover" onClick={() => navigate("/Port")}>
              Go to app
            </button>
          </div>
          {/* <canvas ref={canvasRef} id="canvas3d" /> */}

          <div className="lg:col-span-6 ml-10 mb-20 relative">
            <div className="blobanimation absolute top-0 left-0" />

            <img
              src="../../Images/aiImage.png"
              className="w-full h-auto mt-[10px] relative z-20"
              alt="Image"
            />
          </div>
        </div>
      </section>

      <Video />
      <About />
    </Fragment>
  );
}

export default Home;
