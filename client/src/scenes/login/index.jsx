import { Link, useNavigate } from "react-router-dom";
import { React, useState } from "react";
import styles from "./styles.module.css";

async function fetchGet(url) {
    try {
        let response = await fetch(`http://localhost:8080/api/${url}`);
        let responseData = await response.json();
        return responseData;
    } catch (error) {
        throw new Error(`Error getting data: ${error}`);
    }
}

function Login() {
    const [email, setEmail] = useState("");
    const [passwordHash, setPasswordHash] = useState("");
    const navigate = useNavigate();

    const googleAuth = () => {
        window.open(
            `http://localhost:8080/auth/google/callback`,
            "_self"
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let response = await fetchGet(`login/${email}/${passwordHash}`);
            if (response.error) {
                alert(response.error);
                return;
            }
            console.log("User was found");
            console.log("Url:");
            console.log(response.url);
            console.log("Response:");
            console.log(response);
            const hypotheticalUser = await response.json();
            console.log(hypotheticalUser);
            navigate("/dashboard", { state: { user: hypotheticalUser } });
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
