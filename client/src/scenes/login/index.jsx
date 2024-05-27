import { zodResolver } from "@hookform/resolvers/zod";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { React, useContext } from "react";
import { Helmet } from "react-helmet";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { z } from "zod";
import { UserContext } from "../../App";
import { googleLoginUser, loginUser } from "../../services/auth";
import styles from "./styles.module.css";

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
        console.log(`[LOGIN] Error logging in via Google: ${err}`);
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
      <div className={styles.container}>
        <h1 className={styles.heading}>Log in Form</h1>
        <div className={styles.form_container}>
          <div className={styles.left}>
            <img className={styles.img} src="./images/login.jpg" alt="login" />
          </div>
          <div className={styles.right}>
            <h2 className={styles.from_heading}>Members Log in</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
              <input
                {...register("email", {
                  required: "Email is required",
                })}
                type="text"
                className={styles.input}
                placeholder="Email"
                required
              />
              {!errors.email && <br />}
              {errors.email && <div className={styles.error_message}>{errors.email.message}</div>}
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
              {errors.passwordHash && <div className={styles.error_message}>{errors.passwordHash.message}</div>}
              <button disabled={isSubmitting} className={styles.btn}>
                {isSubmitting ? "Logging in..." : "Log in"}
              </button>
            </form>
            <p className={styles.text}>or</p>
            <button disabled={isSubmitting} className={styles.google_btn} onClick={googleLogin}>
              <img src="./images/google.png" alt="google icon" />
              Sing in with Google
            </button>
            <p className={styles.text}>
              New Here ? <Link to="/signup">Sing Up</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
