import React from 'react';
import "./Share.css";
import Swal from 'sweetalert2';
const Share = ({ url }) => {
  const shareNft = () => {
    if (url) {
      // Create a temporary textarea element to copy the URL
      const textArea = document.createElement('textarea');
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);

      // Show a SweetAlert with the "Link copied" message
      Swal.fire({
        title: 'Link Copied!',
        icon: 'success',
        showConfirmButton: false,
        timer: 2000, // Automatically close after 2 seconds
      });
    }
  };

  return (
    <div style={{ position: "relative", left: "500px", rotate: "-3deg" }}>
      <button onClick={shareNft} className="Btn">
        <span className="svgContainer">
          <svg viewBox="0 0 448 512">
            <path d="M352 224c53 0 96-43 96-96s-43-96-96-96s-96 43-96 96c0 4 .2 8 .7 11.9l-94.1 47C145.4 170.2 121.9 160 96 160c-53 0-96 43-96 96s43 96 96 96c25.9 0 49.4-10.2 66.6-26.9l94.1 47c-.5 3.9-.7 7.8-.7 11.9c0 53 43 96 96 96s96-43 96-96s-43-96-96-96c-25.9 0-49.4 10.2-66.6 26.9l-94.1-47c.5-3.9 .7-7.8 .7-11.9s-.2-8-.7-11.9l94.1-47C302.6 213.8 326.1 224 352 224z" />
          </svg>
        </span>
        <span className="textContainer">Share</span>
      </button>
    </div>
  );
}

export default Share;
