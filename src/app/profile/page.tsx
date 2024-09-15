"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Loading from "../components/Loading";

interface IPost {
  id: number;
  title: string;
  description: string;
  createdAt: string;
}

interface IUserProfile {
  name: string;
  email: string;
}

export default function Dashboard() {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [userProfile, setUserProfile] = useState<IUserProfile | null>(null);
  const [isPostsLoading, setIsPostsLoading] = useState(true);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostDescription, setNewPostDescription] = useState("");
  const [editName, setEditName] = useState(userProfile?.name || "");
  const [editEmail, setEditEmail] = useState(userProfile?.email || "");

  const router = useRouter();

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

  const handleCreatePost = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch("/api/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: newPostTitle,
        description: newPostDescription,
      }),
    });

    if (res.ok) {
      const newPost = await res.json();
      setPosts([newPost, ...posts]);
      setNewPostTitle("");
      setNewPostDescription("");
      setShowCreatePost(false);
    }
  };

  const handleUpdateProfile = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch("/api/user", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: editName,
        email: editEmail,
      }),
    });

    if (res.ok) {
      const updatedUser = await res.json();
      setUserProfile(updatedUser);
      setShowEditProfile(false);
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
            <input
              type="text"
              value={newPostTitle}
              onChange={(e) => setNewPostTitle(e.target.value)}
              placeholder="Title"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm mb-4"
            />
            <textarea
              value={newPostDescription}
              onChange={(e) => setNewPostDescription(e.target.value)}
              placeholder="Description"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm mb-4"
              rows={4}
            />
            <button
              onClick={handleCreatePost}
              className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-sm hover:bg-indigo-700"
            >
              Create Post
            </button>
          </div>
        )}

        <div className="space-y-6">
          {isPostsLoading ? (
            <Loading />
          ) : (
            <div>
              {posts.map((post) => (
                <div
                  key={post.id}
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
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Name"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm mb-4"
                />
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  placeholder="Email"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm mb-4"
                />
                <button
                  onClick={handleUpdateProfile}
                  className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-sm hover:bg-indigo-700"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setShowEditProfile(false)}
                  className="ml-4 px-4 py-2 bg-gray-300 text-gray-800 font-semibold rounded-lg shadow-sm hover:bg-gray-400"
                >
                  Cancel
                </button>
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
