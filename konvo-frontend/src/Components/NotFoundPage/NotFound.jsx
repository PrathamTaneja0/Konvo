import React from "react";
import notFoundImg from "../../assets/notFound.webp";

const NotFound = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
    <img src={notFoundImg} alt="Not Found" className="w-64 h-64 object-contain mb-8" />
    <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-2">404 - Page Not Found</h2>
    <p className="text-lg text-gray-600 dark:text-gray-400">Sorry, the page you are looking for does not exist.</p>
  </div>
);

export default NotFound;

// Prompt: "How do I implement a custom 404 page with navigation back to home?"
// Prompt: "The dark mode is not working on the 404 page. How can I fix this?" 