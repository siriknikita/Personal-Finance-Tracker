import { zodResolver } from "@hookform/resolvers/zod";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { React, useContext } from "react";
import { Helmet } from "react-helmet";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { UserContext } from "../../contexts";
import { googleRegisterUser, registerUser } from "../../services/auth";
import { signupSchema } from "../forms/schemas";

function Signup() {
  const { setUser, setIsAuthorized } = useContext(UserContext);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(signupSchema),
  });
  const navigate = useNavigate();

  const googleRegister = useGoogleLogin({
    onSuccess: async (respose) => {
      try {
        const res = await axios.get(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: {
              Authorization: `Bearer ${respose.access_token}`,
            },
          }
        );
        const data = res.data;
        const user = await googleRegisterUser(data.email);
        setUser(user);
        setIsAuthorized(true);
        navigate("/dashboard");
        toast.success("Registered via Google successfully!");
      } catch (err) {
        console.error("Error in google register:", err);
        throw new Error("Error in google register: ", err);
      }
    },
  });

  const onSubmit = async (data) => {
    try {
      const { username, email, passwordHash } = data;
      const user = await registerUser(username, email, passwordHash);
      if (user) {
        setUser(user);
        setIsAuthorized(true);
        navigate("/dashboard");
        toast.success("Logged in successfully!");
      }
    } catch (error) {
      toast.error("Something went wrong! Please try again.");
      console.error("Error signing up:", error);
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
        <title>Sign Up</title>
      </Helmet>
      {/* Container */}
      <div className="w-screen h-screen bg-[#f0f8ff] flex flex-col justify-center items-center">
        {/* Title */}
        <div className="text-[40px] font-semibold text-[#2c444e] relative flex flex-col items-center justify-center">
          <h1>Signup Form</h1>
          <div className="divider divider-primary"></div>
        </div>
        {/* Register rform "containter" */}
        <div className="flex align-middle text-center w-[800px] h-[450px] bg-[white] shadow-[3px_4px_36px_-6px_rgba(0,0,0,0.4)] mt-[15px] rounded-[50px]">
          {/* Register image */}
          <div className="flex-[1.5] overflow-hidden relative rounded-tl-[50px] rounded-bl-[50px]">
            <img
              className="w-auto h-auto mt-6"
              src="./images/signup.jpg"
              alt="signup"
            />
          </div>
          {/* Login form */}
          <div className="flex-[1.5] flex flex-col items-center justify-center">
            {/* Form title */}
            <h2 className="text-2xl font-normal text-[#2c444e] mb-4">Signup</h2>
            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-4">
                {/* Username Field */}
                <label className="input input-bordered flex items-center gap-2 shrink">
                  Username:
                  <input
                    {...register("username", {
                      required: "Username is required",
                    })}
                    type="text"
                    className="m-1"
                    placeholder="Username"
                    required
                  />
                </label>
                {/* Email Field */}
                <label className="input input-bordered flex items-center gap-2 shrink">
                  Email:
                  <input
                    {...register("email", {
                      required: "Email is required",
                    })}
                    type="email"
                    className="m-1"
                    placeholder="Email"
                    required
                  />
                </label>
                {/* Password Field */}
                <label className="input input-bordered flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    className="w-4 h-4 opacity-70"
                  >
                    <path
                      fillRule="evenodd"
                      d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <input
                    {...register("passwordHash", {
                      required: "Password is required",
                    })}
                    type="password"
                    placeholder="Password"
                    className="grow"
                  />
                </label>
              </div>
              <div className="flex flex-row items-center justify-center">
                {/* Submit button */}
                <button
                  disabled={isSubmitting}
                  className={`w-[230px] h-10 rounded-md bg-[#ffc801] shadow-md font-medium text-lg text-[#2c444e] cursor-pointer flex items-center justify-center mt-4 ${
                    isSubmitting
                      ? "cursor-not-allowed btn-disabled"
                      : "cursor-pointer"
                  }`}
                  type="submit"
                >
                  {isSubmitting ? "Signing up..." : "Sign Up"}
                </button>
              </div>
            </form>
            <p className="text-sm text-[#2c444e] mt-2">or</p>
            {/* Google Register */}
            <button
              disabled={isSubmitting}
              className={`w-[230px] h-10 rounded-md bg-white shadow-md font-medium text-lg text-[#2c444e] cursor-pointer flex items-center justify-center mt-2 ${
                isSubmitting
                  ? "cursor-not-allowed btn-disabled"
                  : "cursor-pointer"
              }`}
              onClick={googleRegister}
            >
              <img
                src="./images/google.png"
                alt="google icon"
                className="w-8 h-8 object-cover"
              />
              <span className="ml-2">Sign up with Google</span>
            </button>
            <p className="text-sm text-[#2c444e] mt-4">
              Already Have Account?{" "}
              <Link
                to="/login"
                className="text-[#ffc801] text-base font-medium"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Signup;
