import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import styles from "./styles.module.css";

function Login() {
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
			const response = await fetch(`${process.env.REACT_APP_API_URL}/api/login`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ email: email, passwordHash: passwordHash }),
			});
			if (response.ok) {
				console.log("User logged in successfully!");
				navigate("/dashboard", { state: { userEmail: email } });
			} else {
				console.error("Login failed:", await response.text());
			}
		} catch (error) {
			console.error("Error logging in:", error);
		}
	};
	
	return (
		<div className={styles.container}>
			<h1 className={styles.heading}>Log in Form</h1>
			<div className={styles.form_container}>
				<div className={styles.left}>
					<img className={styles.img} src="./images/login.jpg" alt="login" />
				</div>
				<div className={styles.right}>
					<h2 className={styles.from_heading}>Members Log in</h2>
					<form onSubmit={handleSubmit}>
						<input 
						type="text"
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
						<button className={styles.btn}>Log In</button>
					</form>
					<p className={styles.text}>or</p>
					<button className={styles.google_btn} onClick={googleAuth}>
						<img src="./images/google.png" alt="google icon" />
						<span>Sing in with Google</span>
					</button>
					<p className={styles.text}>
						New Here ? <Link to="/signup">Sing Up</Link>
					</p>
				</div>
			</div>
		</div>
	);
}

export default Login;
