"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import PostsList from "../components/PostsList/PostsList";
import { IPost } from "../profile/page";
import Loading from "../components/Loading/Loading";
import Link from "next/link";

export default function Posts() {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      //  получение новых постов
      const res = await fetch("/api/posts");

      if (res.ok) {
        const resData = await res.json();

        setPosts(resData.posts);
        setIsLoadingPosts(false);
      }
    })();
  }, [router]);

  return (
    <div>
      <div className="flex min-h-screen bg-gray-100">
        <div className="container mx-auto p-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Posts</h1>
            <Link href="/profile">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </Link>
          </div>
          {isLoadingPosts ? (
            <Loading />
          ) : posts.length ? (
            <PostsList posts={posts} />
          ) : (
            <h3 className="text-center text-5xl pt-5 font-bold">
              The list is empty
            </h3>
          )}
        </div>
      </div>
    </div>
  );
}
