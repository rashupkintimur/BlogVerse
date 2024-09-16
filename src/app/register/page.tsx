"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Loading from "../components/Loading/Loading";
import Link from "next/link";

interface IFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormData>();
  const router = useRouter();
  const [responseMessage, setResponseMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: IFormData) => {
    if (data.password !== data.confirmPassword) {
      setResponseMessage("Passwords do not match!");
      return;
    }

    setIsLoading(true);
    const res = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        password: data.password,
      }),
    });

    const result = await res.json();
    if (res.ok) {
      // Сохранение токена в localStorage
      localStorage.setItem("token", result.token);
      router.push("/dashboard");
    } else {
      setIsLoading(false);
      setResponseMessage(result.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-md rounded-lg">
        <h1 className="text-2xl font-bold text-center text-gray-900">
          Create an Account
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 cursor-pointer"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              {...register("name", {
                minLength: {
                  value: 4,
                  message: "Name must be at least 4 characters",
                },
                required: "Name is required",
              })}
            />
            {errors.name && (
              <p className="text-red-500">{errors.name.message}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 cursor-pointer"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Invalid email address",
                },
              })}
            />
            {errors.email && (
              <p className="text-red-500">{errors.email.message}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 cursor-pointer"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              {...register("password", {
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
                required: "Password is required",
              })}
            />
            {errors.password && (
              <p className="text-red-500">{errors.password.message}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 cursor-pointer"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              {...register("confirmPassword")}
            />
          </div>
          {<p className="text-red-500">{responseMessage}</p>}
          {isLoading ? <Loading /> : null}
          <Link href="/login" className="pt-5 text-blue-700">
            Do you already have an account?
          </Link>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}
