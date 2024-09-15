import React from "react";
import "./Loading.css";

const Loading: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="flex items-center justify-center space-x-2">
        <div className="w-8 h-8 border-4 border-t-4 border-blue-500 border-opacity-50 rounded-full animate-spin"></div>
        <span className="text-blue-500 text-lg font-medium">Loading...</span>
      </div>
    </div>
  );
};

export default Loading;
