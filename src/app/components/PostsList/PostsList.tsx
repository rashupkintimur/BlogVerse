import { IPost } from "@/app/profile/page";
import Link from "next/link";
import React from "react";

interface IPostsList {
  posts: IPost[];
  handleDelete?: (id: string) => void;
}

const PostsList: React.FC<IPostsList> = ({ posts, handleDelete }) => {
  return (
    <ul className="grid gap-5">
      {posts.map((post) => (
        <li className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow flex justify-between items-start">
          <Link
            key={post._id}
            href={`/posts/${post._id}`}
            className="flex-grow"
          >
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {post.title}
              </h2>
              <p className="mt-2 text-gray-700">{post.description}</p>
              <p className="mt-4 text-sm text-gray-500">
                Posted on {new Date(post.createdAt).toLocaleDateString()}
              </p>
            </div>
          </Link>
          {handleDelete ? (
            <button
              onClick={() => handleDelete(String(post._id))}
              className="bg-red-500 relative z-10 text-white rounded px-5 py-2 ml-4"
            >
              Delete
            </button>
          ) : null}
        </li>
      ))}
    </ul>
  );
};

export default PostsList;
