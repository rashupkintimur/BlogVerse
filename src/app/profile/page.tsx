"use client";

import { useEffect, useState } from "react";
import Loading from "../components/Loading/Loading";
import { useForm } from "react-hook-form";
import CreatePostForm from "../components/CreatePostForm/CreatePostForm";
import EditProfileForm from "../components/EditProfileForm/EditProfileForm";

interface IPost {
  _id: number;
  title: string;
  description: string;
  createdAt: string;
}

export interface IUserProfile {
  name: string;
  email: string;
}

export interface IPostForm {
  title: string;
  description: string;
}

export default function Profile() {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [userProfile, setUserProfile] = useState<IUserProfile | null>(null);
  const [isPostsLoading, setIsPostsLoading] = useState(true);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const {
    register: registerPost,
    handleSubmit: submitPost,
    formState: { errors: postErrors },
  } = useForm<IPostForm>();
  const {
    register: registerProfile,
    handleSubmit: submitProfile,
    formState: { errors: profileErrors },
  } = useForm<IUserProfile>();

  useEffect(() => {
    (async () => {
      // Загрузка данных постов
      const postsRes = await fetch("/api/posts");

      // Загрузка данных пользователя
      const token = localStorage.getItem("token");
      const userRes = await fetch("/api/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (userRes.ok && postsRes.ok) {
        const userData = await userRes.json();
        const postsData = await postsRes.json();

        setUserProfile(userData);
        setPosts(postsData.posts);
        setIsPostsLoading(false);
      }
    })();
  }, []);

  // обработчик создания поста
  const handleCreatePost = async (data: IPostForm) => {
    const token = localStorage.getItem("token");

    const res = await fetch("/api/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: data.title,
        description: data.description,
      }),
    });

    if (res.ok) {
      const newPost = await res.json();
      setPosts([newPost, ...posts]);
      setShowCreatePost(false);
    }
  };

  // обработчик изменения данных пользователя
  const handleUpdateProfile = async (data: IUserProfile) => {
    const token = localStorage.getItem("token");

    setUserProfile(null);
    const res = await fetch("/api/user", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: data.name,
        email: data.email,
      }),
    });

    if (res.ok) {
      const updatedUser = await res.json();
      setUserProfile(updatedUser);
      setShowEditProfile(false);
      setUserProfile(updatedUser);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Секция постов */}
      <div className="w-2/3 p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Your Posts</h1>
          <button
            onClick={() => setShowCreatePost(!showCreatePost)}
            className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-sm hover:bg-indigo-700"
          >
            {showCreatePost ? "Cancel" : "Create New Post"}
          </button>
        </div>

        {showCreatePost && (
          <div className="mb-6 p-4 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              New Post
            </h2>
            <CreatePostForm
              handle={handleCreatePost}
              submitForm={submitPost}
              register={registerPost}
              errors={postErrors}
            />
          </div>
        )}

        <div className="space-y-6">
          {isPostsLoading ? (
            <Loading />
          ) : (
            <div className="grid gap-5">
              {posts.map((post) => (
                <div
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
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Секция профиля */}
      <div className="w-1/3 p-8 bg-white shadow-lg">
        {userProfile ? (
          <div>
            {!showEditProfile ? (
              <div className="flex flex-col items-center space-y-4">
                <h2 className="text-2xl font-semibold text-gray-900">
                  {userProfile.name}
                </h2>
                <p className="text-gray-600">{userProfile.email}</p>
                <button
                  onClick={() => setShowEditProfile(true)}
                  className="mt-6 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-sm hover:bg-indigo-700"
                >
                  Edit Profile
                </button>
              </div>
            ) : (
              <div className="p-4 bg-white rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Edit Profile
                </h2>
                <EditProfileForm
                  handle={handleUpdateProfile}
                  submitForm={submitProfile}
                  register={registerProfile}
                  errors={profileErrors}
                  setShowEditProfile={setShowEditProfile}
                />
              </div>
            )}
          </div>
        ) : (
          <Loading />
        )}
      </div>
    </div>
  );
}
