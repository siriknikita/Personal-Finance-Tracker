import { zodResolver } from "@hookform/resolvers/zod";
import React, { useContext } from "react";
import { Helmet } from "react-helmet";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Header } from "../../../components";
import { UserContext } from "../../../contexts";
import { fetchData } from "../../../services/dataProcessing";
import { updateUser } from "../../../utils/user";
import { profileSchema } from "../schemas";

function ProfileForm() {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(profileSchema),
  });

  const onSubmit = async (data) => {
    try {
      let responseMessage = await updateUser(data);
      if (responseMessage.includes("Error! ")) {
        responseMessage = responseMessage.replace("Error! ", "");
        toast.error(responseMessage);
      } else {
        await updateUser(data);
        toast.success("Profile updated successfully!");
        const updatedUser = await fetchData(`user/get/${data.email}`, "user");
        setUser(updatedUser);
        console.log(updatedUser);
        navigate("/dashboard");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update profile!");
    }
  };

  if (errors) {
    for (const error in errors) {
      toast.error(errors[error].message);
    }
  }

  return (
    <>
      <Helmet>
        <title>Profile Form</title>
      </Helmet>
      <Header title="Profile Form" subtitle="Update your profile" />
      <form onSubmit={handleSubmit(onSubmit)} className="p-4">
        <div className="flex flex-col gap-4">
          {/* Username + Email */}
          <div className="flex flex-row gap-2">
            <div className="grow">
              {/* Username */}
              <label className="input input-bordered flex items-center gap-2">
                Username
                <input
                  {...register("newUsername", {
                    required: true,
                    minLength: 3,
                    maxLength: 20,
                  })}
                  type="text"
                  className="grow"
                  placeholder="Username"
                  defaultValue={user.username}
                  disabled={isSubmitting}
                />
              </label>
            </div>
            <div className="grow">
              {/* Email */}
              <label className="input input-bordered flex items-center gap-2">
                Email
                <input
                  {...register("email", {
                    required: true,
                  })}
                  type="text"
                  readOnly={true}
                  className="grow"
                  placeholder="your@email.com"
                  defaultValue={user.email}
                  disabled={isSubmitting}
                />
              </label>
            </div>
          </div>
          {/* Password */}
          <div className="flex flex-col gap-4">
            {/* New password */}
            <label className="input input-bordered flex items-center gap-2">
              New Password
              <input
                {...register("newPassword", {
                  required: false,
                })}
                type="password"
                className="grow"
                placeholder="New Password"
                disabled={isSubmitting}
              />
            </label>
            {/* Confirm New Password */}
            <label className="input input-bordered flex items-center gap-2">
              Confirm Password
              <input
                {...register("confirmedNewPassword", {
                  required: false,
                })}
                type="password"
                className="grow"
                placeholder="Confirmed Password"
                disabled={isSubmitting}
              />
            </label>
          </div>
          <button
            disabled={isSubmitting}
            className="btn btn-neutral w-32 max-w-36"
            type="submit"
          >
            {isSubmitting ? "Updating profile..." : "Update profile"}
          </button>
        </div>
      </form>
    </>
  );
}

export default ProfileForm;
