// import React from "react";
import spinner from "@assets/Spin.gif"

const Spinner = () => { 
  return (
    <div className="flex justify-center items-center ">
      <div className="mb-50 scroll-auto overflow-hidden">
        {/* <style>
          {`
           .loader {
  border: 8px solid #f3f3f3;
  border-top: 8px solid #3498db;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  animation: spin 2s linear infinite;
  position: relative;
  z-index: 9999;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
} 
        `}
        </style> */}
        <div className="mt-30">
           <img
          // src="https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif"
          src={spinner}
          width={100}
          alt="loading_gif"
        />
        </div>
       
      </div>
    </div>
  );
};

export default Spinner;
