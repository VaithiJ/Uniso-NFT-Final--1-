import React from "react";
 
function About() {
  return (
    <div class="min-h-screen text-white">
      <div class="container mx-auto flex items-center justify-center py-24">
        <div class="glassmorphism-container shadow-xl">
          <div class="container mx-auto flex items-center justify-center py-24 p-12">
            <div class="lg:w-2/4">
              <img
                class="object-cover object-center"
                alt="hero"
                src="../../Images/About.png"
              />
            </div>
            <div class="lg:w-4/6 p-12 md:w-3/6 w-5/6 text-center relative">
              <img class="absolute inset-0 object-cover object-center transform translate-x-[175px] translate-y-[90px] opacity-50  " alt="hero" src="../../Images/NFT_bg.png" />
              <div class="relative z-10">
                <h1 class="my-4 text-5xl text-black font-bold leading-tight">
                SBT token for every soul
                </h1>
                <p class="text-2xl text-gray-500 mb-8">
                After successful phone number verification, individuals are awarded an SBT token NFT, which acts as their verified digital identity certificate on the web3 platform.
                </p>
              </div>
            </div>
 
 
          </div>
        </div>
      </div>
    </div>
  );
}
 
export default About;