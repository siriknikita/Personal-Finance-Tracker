import { zodResolver } from "@hookform/resolvers/zod";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { React, useContext } from "react";
import { Helmet } from "react-helmet";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { z } from "zod";
import { UserContext } from "../../contexts";
import { googleLoginUser, loginUser } from "../../services/auth";

const schema = z.object({
  email: z.string().email(),
  passwordHash: z.string().min(8),
});

function Login() {
  const { setUser, setIsAuthorized } = useContext(UserContext);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
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
        const email = res.data.email;
        const user = await googleLoginUser(email);
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

  return (
    <>
      <Helmet>
        <title>Login</title>
      </Helmet>
      <div className="w-screen h-screen bg-blue-50 flex flex-col justify-center items-center">
        <h1 className="text-4xl font-semibold text-[#2c444e] relative flex items-center justify-center">
          Log in Form
          <span className="absolute w-[450px] h-1 bg-[#2c444e] rounded-sm bottom-[-20px]"></span>
        </h1>
        <div className="mt-4 w-[800px] h-[450px] bg-white shadow-lg rounded-[50px] flex">
          <div className="flex-[1.5] overflow-hidden relative rounded-tl-[50px] rounded-bl-[50px]">
            <img
              className="w-[160%] absolute left-[-150px] top-[-50px]"
              src="./images/login.jpg"
              alt="login"
            />
          </div>
          <div className="flex-2 flex flex-col items-center justify-center">
            <h2 className="text-2xl font-normal text-[#2c444e] mb-8">
              Members Log in
            </h2>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="w-full flex flex-col items-center"
            >
              <input
                {...register("email", {
                  required: "Email is required",
                })}
                type="text"
                // className={styles.input}
                placeholder="Email"
                required
              />
              {!errors.email && <br />}
              {errors.email && <div>{errors.email.message}</div>}
              <input
                {...register("passwordHash", {
                  required: "Password is required",
                })}
                type="password"
                // className={styles.input}
                placeholder="Password"
                required
              />
              {!errors.passwordHash && <br />}
              {errors.passwordHash && <div>{errors.passwordHash.message}</div>}
              {/* form fields here */}
              <button
                disabled={isSubmitting}
                className={`text-lg font-medium py-3 px-6 text-white bg-[#ffc801] rounded-xl mt-2 outline-none border-none cursor-pointer 
            ${isSubmitting ? "bg-[#ffc80180] cursor-not-allowed" : ""}`}
              >
                {isSubmitting ? "Logging in..." : "Log in"}
              </button>
            </form>
            <p className="text-sm text-[#2c444e] mt-4">or</p>
            <button
              disabled={isSubmitting}
              className={`w-[230px] h-10 rounded-md bg-white shadow-md font-medium text-lg text-[#2c444e] cursor-pointer flex items-center justify-center mt-4 
          ${isSubmitting ? "bg-opacity-50 cursor-not-allowed" : ""}`}
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
