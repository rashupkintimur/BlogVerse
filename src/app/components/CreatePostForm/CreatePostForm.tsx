import { IPostForm } from "@/app/profile/page";
import {
  FieldErrors,
  UseFormHandleSubmit,
  UseFormRegister,
} from "react-hook-form";

interface ICreatePostForm {
  handle: (data: IPostForm) => void;
  submitForm: UseFormHandleSubmit<IPostForm>;
  register: UseFormRegister<IPostForm>;
  errors: FieldErrors<IPostForm>;
}

const CreatePostForm: React.FC<ICreatePostForm> = ({
  handle,
  submitForm,
  register,
  errors,
}) => {
  return (
    <form onSubmit={submitForm(handle)}>
      <div>
        <input
          type="text"
          placeholder="Title"
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm mb-4"
          {...register("title", {
            minLength: {
              value: 4,
              message: "Title must be at least 4 characters",
            },
            required: "Title is required",
          })}
        />
        {errors.title && <p className="text-red-500">{errors.title.message}</p>}
      </div>
      <div>
        <textarea
          placeholder="Description"
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm mb-4 resize-none"
          rows={4}
          {...register("description", {
            minLength: {
              value: 4,
              message: "Description must be at least 4 characters",
            },
            required: "Description is required",
          })}
        />
        {errors.description && (
          <p className="text-red-500">{errors.description.message}</p>
        )}
      </div>
      <button className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-sm hover:bg-indigo-700">
        Create Post
      </button>
    </form>
  );
};

export default CreatePostForm;
