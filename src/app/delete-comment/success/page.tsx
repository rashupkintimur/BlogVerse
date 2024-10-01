"use client";

import Link from "next/link";

export default function Success() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-red-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">
          Comment Deleted!
        </h2>
        <p className="text-gray-700 mb-6">
          The comment has been successfully deleted.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            href="/posts"
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
          >
            Go Back to Posts List
            {/* <a className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">
              
            </a> */}
          </Link>
        </div>
      </div>
    </div>
  );
}
