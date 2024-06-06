import { zodResolver } from "@hookform/resolvers/zod";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { React, useContext } from "react";
import { Helmet } from "react-helmet";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { UserContext } from "../../contexts";
import { googleLoginUser, loginUser } from "../../services/auth";
import { loginSchema } from "../forms/schemas";


function Login() {
  const { setUser, setIsAuthorized } = useContext(UserContext);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const googleLogin = useGoogleLogin({
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
        console.log("res:", res);
        const email = res.data.email;
        const user = await googleLoginUser(email);
        console.log("User:", user);
        setUser(user);
        setIsAuthorized(true);
        navigate("/dashboard");
        toast.success("Logged in via Google successfully!");
      } catch (err) {
        console.error(`[LOGIN] Error logging in via Google: ${err}`);
        toast.error("Error logging in via Google!");
      }
    },
  });

  const onSubmit = async (data) => {
    try {
      const { email, passwordHash } = data;
      const isAdmin = email === "admin@email.com";
      const user = await loginUser(email, passwordHash);
      setUser(user);
      setIsAuthorized(true);
      if (isAdmin) {
        navigate("/adminDashboard");
      } else {
        navigate("/dashboard");
      }
      toast.success("Logged in successfully!");
      if (isAdmin) {
        toast.success("Admin Permissions granted!");
      }
    } catch (error) {
      toast.error("Invalid email or password!");
      console.error("Error logging in:", error);
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
        <title>Login</title>
      </Helmet>
      {/* Container */}
      <div className="w-screen h-screen bg-[#f0f8ff] flex flex-col justify-center items-center">
        {/* Title */}
        <div className="text-[40px] font-semibold text-[#2c444e] relative flex flex-col items-center justify-center">
          <h1
          // className="text-4xl font-bold text-[#2c444e]"
          >
            Welcome Back!
          </h1>
          <div className="divider divider-primary"></div>
        </div>
        {/* Login form "containter" */}
        <div className="flex align-middle text-center w-[800px] h-[450px] bg-[white] shadow-[3px_4px_36px_-6px_rgba(0,0,0,0.4)] mt-[15px] rounded-[50px]">
          {/* Login image */}
          <div className="flex-[1.5] overflow-hidden relative rounded-tl-[50px] rounded-bl-[50px]">
            <img
              className="w-auto h-auto mt-6"
              src="./images/login.jpg"
              alt="login"
            />
          </div>
          {/* Login form */}
          <div className="flex-[1.5] flex flex-col items-center justify-center">
            {/* Form title */}
            <h2 className="text-2xl font-normal text-[#2c444e] mb-4">
              Members Log in
            </h2>
            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-4">
                {/* Email Field */}
                <label className="input input-bordered flex items-center gap-2 shrink">
                  Email:
                  <input
                    {...register("email", {
                      required: "Email is required",
                    })}
                    type="text"
                    className="m-1"
                    placeholder="Email"
                    disabled={isSubmitting}
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
                    className="grow"
                    placeholder="Password"
                  />
                </label>
              </div>
              <div className="flex flex-row items-center justify-center">
                {/* Submit button */}
                <button
                  disabled={isSubmitting}
                  className={`w-[230px] h-10 rounded-md bg-[#ffc801] shadow-md font-medium text-lg text-[#2c444e] cursor-pointer flex items-center justify-center mt-4 ${
                    isSubmitting ? "cursor-not-allowed btn-disabled" : "cursor-pointer"
                  }`}
                  type="submit"
                >
                  {isSubmitting ? "Logging in..." : "Log in"}
                </button>
              </div>
            </form>
            <p className="text-sm text-[#2c444e] mt-2">or</p>
            <button
              disabled={isSubmitting}
              className={`w-[230px] h-10 rounded-md bg-white shadow-md font-medium text-lg text-[#2c444e] cursor-pointer flex items-center justify-center mt-2 ${
                isSubmitting
                  ? "cursor-not-allowed btn-disabled"
                  : "cursor-pointer"
              }`}
              onClick={googleLogin}
            >
              <img
                src="./images/google.png"
                alt="google icon"
                className="w-8 h-8 object-cover"
              />
              <span className="ml-2">Sign in with Google</span>
            </button>
            <p className="text-sm text-[#2c444e] mt-4">
              New Here?{" "}
              <Link
                to="/signup"
                className="text-[#ffc801] text-base font-medium"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>

    </>
  );
}

export default Login;
