import { IUserProfile } from "@/app/profile/page";
import {
  FieldErrors,
  UseFormHandleSubmit,
  UseFormRegister,
} from "react-hook-form";

interface IEditProfileForm {
  handle: (data: IUserProfile) => void;
  submitForm: UseFormHandleSubmit<IUserProfile>;
  register: UseFormRegister<IUserProfile>;
  errors: FieldErrors<IUserProfile>;
  setShowEditProfile: (value: boolean) => void;
}

const EditProfileForm: React.FC<IEditProfileForm> = ({
  handle,
  submitForm,
  register,
  errors,
  setShowEditProfile,
}) => {
  return (
    <form onSubmit={submitForm(handle)}>
      <div>
        <input
          type="text"
          placeholder="Name"
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm mb-4"
          {...register("name", {
            minLength: {
              value: 4,
              message: "Name must be at least 4 characters",
            },
            required: "Name is required",
          })}
        />
        {errors.name && <p className="text-red-500">{errors.name.message}</p>}
      </div>
      <div>
        <input
          type="email"
          placeholder="Email"
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm mb-4"
          {...register("email", {
            minLength: {
              value: 4,
              message: "Email must be at least 4 characters",
            },
            required: "Email is required",
          })}
        />
        {errors.email && <p className="text-red-500">{errors.email.message}</p>}
      </div>
      <button className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-sm hover:bg-indigo-700">
        Save Changes
      </button>
      <button
        onClick={() => setShowEditProfile(false)}
        className="ml-4 px-4 py-2 bg-gray-300 text-gray-800 font-semibold rounded-lg shadow-sm hover:bg-gray-400"
      >
        Cancel
      </button>
    </form>
  );
};

export default EditProfileForm;
