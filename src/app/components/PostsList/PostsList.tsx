import { IPost } from "@/app/profile/page";
import Link from "next/link";
import React from "react";

interface IPostsList {
  posts: IPost[];
}

const PostsList: React.FC<IPostsList> = ({ posts }) => {
  return (
    <ul className="grid gap-5">
      {posts.map((post) => (
        <Link href={`/posts/${post._id}`}>
          <li
            key={post._id}
            className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <h2 className="text-xl font-semibold text-gray-900">
              {post.title}
            </h2>
            <p className="mt-2 text-gray-700">{post.description}</p>
            <p className="mt-4 text-sm text-gray-500">
              Posted on {new Date(post.createdAt).toLocaleDateString()}
            </p>
          </li>
        </Link>
      ))}
    </ul>
  );
};

export default PostsList;
