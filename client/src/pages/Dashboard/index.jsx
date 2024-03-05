import { Link } from "react-router-dom";
import styles from "./styles.module.css";

function Dashboard() {
    const user = userDetails.user;
	const logout = () => {
		window.open(`${process.env.REACT_APP_API_URL}/auth/logout`, "_self");
	};
    return (
        
    )
}

export default Dashboard;
