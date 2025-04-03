"use client";

import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { FaGoogle, FaGithub } from "react-icons/fa";

export default function Auth() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-8 bg-white dark:bg-gray-800 shadow-lg rounded-2xl text-center"
      >
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Sign in to Continue
        </h1>

        <motion.button
          onClick={() => signIn("google")}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full flex items-center justify-center bg-red-500 text-white py-3 rounded-lg shadow-md hover:bg-red-600 transition mb-4"
        >
          <FaGoogle className="mr-3 text-xl" />
          Sign in with Google
        </motion.button>

        <motion.button
          onClick={() => signIn("github")}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full flex items-center justify-center bg-gray-900 text-white py-3 rounded-lg shadow-md hover:bg-gray-700 transition"
        >
          <FaGithub className="mr-3 text-xl" />
          Sign in with GitHub
        </motion.button>
      </motion.div>
    </div>
  );
}
