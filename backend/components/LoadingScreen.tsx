import React from 'react';

const LoadingScreen = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Loading Campus Eats...</h2>
      <p className="text-gray-600 dark:text-gray-400 mt-2">Please wait while we prepare your experience</p>
    </div>
  );
};

export default LoadingScreen; 