import React from "react";

function Head() {
  return (
    <header>
      <nav className=" border-gray-200 px-4 lg:px-6 py-2.5 h-16">
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl max-h-full">
          <a href="/" className="flex items-center h-16">
            <img
              src="../../Images/Uniso logoB.png"
              className="mr-3 w-42 h-14 sm:w-40 sm:h-14" // Set a consistent height for the logo
              alt="Flowbite Logo"
            />
            {/* <span className="self-center text-2xl font-semibold whitespace-nowrap ">
          UNISO
        </span> */}
          </a>
        </div>
      </nav>
    </header>
  );
}

export default Head;
