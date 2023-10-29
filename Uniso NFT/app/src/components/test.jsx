import React, { Fragment, useEffect, useRef } from "react";
import { Application } from "@splinetool/runtime";

function Home() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const app = new Application(canvas);
    app.load("https://prod.spline.design/CBM-rwGnFDi8Zddv/scene.splinecode");
  }, []);
  return (
    <Fragment>
      <section className="h-[550px]">
        <div className="grid max-w-screen-xl mt-[40px] px-4 py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12">
          <div className="mr-auto place-self-center lg:col-span-6">
            <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl relative font-lato tracking-wide">
              We invest in the{" "}
              <span
                id="gradient-text"
                className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-blue-500 to-violet-500 font-lato tracking-wide">
                World potential
              </span>
            </h1>

            <p className="max-w-2xl text-lg font-medium mb-6 font-sans  text-gray-900 lg:mb-8 md:text-lg lg:text-xl dark:text-gray-400">
              Here at Flowbite we focus on markets where technology, innovation,
              and capital can unlock long-term value and drive economic growth.
            </p>
            <button className="bn632-hover bn24">Mint Identity</button>
            <button className="bn11-hover">Go to app</button>
          </div>
          <div className="lg:col-span-6 ml-10 mb-20">
            <canvas ref={canvasRef} id="canvas3d" />
          </div>
        </div>
      </section>
    </Fragment>
  );
}

export default Home;
