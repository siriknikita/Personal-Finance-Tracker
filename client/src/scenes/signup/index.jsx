import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { React, useContext} from "react";
import { Helmet } from "react-helmet";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { UserContext } from "../../contexts";
import styles from "./styles.module.css";
import { googleRegisterUser, registerUser } from "../../services/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";

const schema = z.object({
  username: z.string().min(3),
  email: z.string().email(),
  passwordHash: z.string().min(8),
});

function Signup() {
  const { setUser, setIsAuthorized } = useContext(UserContext);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
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

  return (
    <>
      <Helmet>
        <title>Sign Up</title>
      </Helmet>
      <div className={styles.container}>
        <h1 className={styles.heading}>Sign up Form</h1>
        <div className={styles.form_container}>
          <div className={styles.left}>
            <img
              className={styles.img}
              src="./images/signup.jpg"
              alt="signup"
            />
          </div>
          <div className={styles.right}>
            <h2 className={styles.from_heading}>Create Account</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
              <input
                {...register("username", {
                  required: "Username is required",
                })}
                type="text"
                className={styles.input}
                placeholder="Username"
                required
              />
              {!errors.username && <br />}
              {errors.username && (
                <div className={styles.error_message}>
                  {errors.username.message}
                </div>
              )}
              <input
                {...register("email", {
                  required: "Email is required",
                })
                }
                type="email"
                className={styles.input}
                placeholder="Email"
                required
              />
              {!errors.email && <br />}
              {errors.email && (
                <div className={styles.error_message}>
                  {errors.email.message}
                </div>
              )}
              <input
                {...register("passwordHash", {
                  required: "Password is required",
                })}
                type="password"
                className={styles.input}
                placeholder="Password"
                required
              />
              {!errors.passwordHash && <br />}
              {errors.passwordHash && (
                <div className={styles.error_message}>
                  {errors.passwordHash.message}
                </div>
              )}
              <button disabled={isSubmitting} className={styles.btn}>
                {isSubmitting ? "Signing up..." : "Sign up"}
              </button>
            </form>
            <p className={styles.text}>or</p>
            <button
              disabled={isSubmitting}
              className={styles.google_btn}
              onClick={googleRegister}
            >
              <img src="./images/google.png" alt="google icon" />
              Sing up with Google
            </button>
            <p className={styles.text}>
              Already Have Account ? <Link to="/login">Log In</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Signup;
