import React from "react";

function Video() {
  return (
    <div className="relative h-screen">
      <video
        autoPlay
        loop
        muted
        className="absolute inset-0 w-full h-full object-cover">
        <source src="../../Images/bg-vdo.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-black opacity-20" />
      <div className="absolute inset-0 flex items-center justify-center p-32">
        <div className=" flex text-center items-center justify-center p-32 backdrop-blur shadow-transparent bg-white/10">
          <h1
            id="heading"
            className="text-5xl font-lato text-white mb-4 text-center">
            One Identity for Everything
          </h1>
          <div className="w-1/3 ">
            <img
              src="../../Images/L left.png"
              alt="Image 1"
              className="w-[50px] mr-[80px] h-auto mb-[160px] ml-10"
            />
          </div>

          <p
            id="parad"
            className="text-lg mt-3 justify-center font-medium font-lato text-gray-200 content-center items-center">
            Our cutting-edge system ensures multi-layered identity validation,
            verifying documents, addresses, and
            phone numbers, providing the ultimate in secure and precise identity
            verification. Trust us to keep your identity safe and sound.
          </p>
          <div className="w-1/3 ">
            <img
              src="../../Images/L right.png"
              alt="Image 1"
              className="w-[50px] h-auto  mt-[180px] ml-10"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Video;
