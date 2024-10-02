"use client";

import CommentsList from "@/app/components/CommentsList/CommentsList";
import Loading from "@/app/components/Loading/Loading";
import { IPost } from "@/app/profile/page";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

interface IPage {
  params: {
    id: string;
  };
}

export interface IComment {
  _id: string;
  userId: string;
  postId: string;
  text: string;
}

export interface IUser {
  _id: string;
  name: string;
}

const Post: React.FC<IPage> = ({ params }) => {
  const router = useRouter();
  const [isLoadingPost, setIsLoadingPost] = useState(true);
  const [post, setPost] = useState<IPost | null>(null);
  const [comments, setComments] = useState<IComment[]>([]);
  const [users, setUsers] = useState<IUser[]>([]);
  const [currentUser, setCurrentUser] = useState<IUser | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IComment>();

  useEffect(() => {
    (async () => {
      //  получение поста
      const resPosts = await fetch(`/api/posts/${params.id}`);

      //  получение поста
      const resComments = await fetch(`/api/posts/${params.id}/comments`);

      // получение текущего пользователя
      const resUser = await fetch("/api/user");

      if (resPosts.ok) {
        const resPostsData = await resPosts.json();
        const resCommentsData = await resComments.json();
        const resUserData = await resUser.json();

        setPost(resPostsData);
        setComments(resCommentsData.comments);
        setUsers(resCommentsData.users);
        setCurrentUser(resUserData);
        setIsLoadingPost(false);
      }
    })();
  }, [router, params.id]);

  // создание комминтария
  const handleCreateComment = async (data: IComment) => {
    const res = await fetch(`/api/posts/${params.id}/comments`, {
      method: "POST",
      body: JSON.stringify(data),
    });

    if (res.ok) {
      router.push("/create-comment/success");
    }
  };

  // удаление комментария
  const handleDeleteComment = async (commentId: string) => {
    const res = await fetch(`/api/posts/${params.id}/comments/${commentId}`, {
      method: "DELETE",
    });

    if (res.ok) {
      router.push("/delete-comment/success");
    }
  };

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
          <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-8">
            <h3 className="text-4xl mb-5">Comments</h3>
            <CommentsList
              comments={comments}
              users={users}
              currentUser={currentUser}
              deleteComment={handleDeleteComment}
            />
            <form
              method="POST"
              onSubmit={handleSubmit(handleCreateComment)}
              className="flex flex-col"
            >
              <div className="mb-4">
                <label
                  htmlFor="comment"
                  className="block text-sm font-medium text-gray-700 cursor-pointer"
                >
                  Your Comment
                </label>
                <textarea
                  id="comment"
                  required
                  className="resize-none h-32 mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-lg"
                  {...register("text", {
                    minLength: {
                      value: 1,
                      message: "Comment must be at least 1 characters",
                    },
                    required: "Comment is required",
                  })}
                />
                {errors.text && (
                  <p className="text-red-500">{errors.text.message}</p>
                )}
              </div>
              <button className="bg-indigo-500 text-white px-3 py-2 rounded">
                Post Comment
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Post;
