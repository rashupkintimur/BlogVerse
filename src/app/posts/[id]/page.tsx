"use client";

import Loading from "@/app/components/Loading/Loading";
import { IPost } from "@/app/profile/page";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface IPage {
  params: {
    id: string;
  };
}

const Post: React.FC<IPage> = ({ params }) => {
  const router = useRouter();
  const [isLoadingPost, setIsLoadingPost] = useState(true);
  const [post, setPost] = useState<IPost | null>(null);

  useEffect(() => {
    (async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/login");
        return;
      }

      //  получение поста
      const postRes = await fetch(`/api/posts/${params.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (postRes.ok) {
        const postData = await postRes.json();

        setPost(postData);
        setIsLoadingPost(false);
      }
    })();
  }, []);

  return (
    <div>
      {isLoadingPost ? (
        <div className="h-screen">
          <Loading />
        </div>
      ) : (
        <div>
          <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-8">
            <Link href="/posts" className="text-xl mb-5 block text-blue-700">
              To the main page
            </Link>
            <header className="border-b pb-4 mb-6">
              <h1 className="text-4xl font-bold text-gray-800 mb-2">
                {post?.title}
              </h1>
              <p className="text-gray-600">{post?.description}</p>
            </header>

            <article className="prose prose-lg">
              <p>{post?.text}</p>
            </article>

            <footer className="mt-8 text-sm text-gray-500">
              <p>Post ID: {params.id}</p>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
};

export default Post;
