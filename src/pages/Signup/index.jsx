import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import styles from "./styles.module.css";

function Signup() {
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [passwordHash, setPasswordHash] = useState("");
	const navigate = useNavigate();

	const googleAuth = () => {
		window.open(
			`${process.env.REACT_APP_API_URL}/auth/google/callback`,
			"_self"
		);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const responce = await fetch(`${process.env.REACT_APP_API_URL}/api/signup`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ username, email, passwordHash }),
			});
			if (responce.ok) {
				console.log("User signed up successfully!");
				navigate("/dashboard");
			} else {
				console.error("Signup failed:", await responce.text());
			}
		} catch (error) {
			console.error("Error signing up:", error);
		}
	};

	return (
		<div className={styles.container}>
			<h1 className={styles.heading}>Sign up Form</h1>
			<div className={styles.form_container}>
				<div className={styles.left}>
					<img className={styles.img} src="./images/signup.jpg" alt="signup" />
				</div>
				<div className={styles.right}>
					<h2 className={styles.from_heading}>Create Account</h2>
					<form onSubmit={handleSubmit}>
						<input
						type="text"
						className={styles.input}
						placeholder="Username"
						value={username}
						onChange={(e) => setUsername(e.target.value)}
						required
						/>
						<input
						type="email"
						className={styles.input}
						placeholder="Email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
						/>
						<input
						type="password"
						className={styles.input}
						placeholder="Password"
						value={passwordHash}
						onChange={(e) => setPasswordHash(e.target.value)}
						required
						/>
						<br />
						<button type="submit" className={styles.btn}>Sign Up</button>
					</form>
					<p className={styles.text}>or</p>
					<button className={styles.google_btn} onClick={googleAuth}>
						<img src="./images/google.png" alt="google icon" />
						<span>Sing up with Google</span>
					</button>
					<p className={styles.text}>
						Already Have Account ? <Link to="/login">Log In</Link>
					</p>
				</div>
			</div>
		</div>
	);
}

export default Signup;
