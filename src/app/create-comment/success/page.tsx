"use client";

import Link from "next/link";

export default function Success() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-green-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg text-center">
        <h2 className="text-2xl font-bold text-green-600 mb-4">
          Comment Created!
        </h2>
        <p className="text-gray-700 mb-6">
          Your comment has been successfully created.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            href="/posts"
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
          >
            Go Back to Posts List
          </Link>
        </div>
      </div>
    </div>
  );
}
