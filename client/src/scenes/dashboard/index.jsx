import styles from "./styles.module.css";
import { useLocation } from "react-router-dom";
import React, { createContext } from "react";
import PaymentOutlineIcon from '@mui/icons-material/PaymentOutlined'

export const DashboardContext = createContext();

// async function fetchData(url) {
//     console.log(url);
//     try {
//         let response = await fetch(`${process.env.REACT_APP_API_URL}/api/${url}`);
//         let data = await response.json();
//         console.log("Data:");
//         console.log(data);
//         return data;
//     } catch (error) {
//         throw new Error(`Error loading data: ${error}`);
//     }
// }

function Dashboard() {
    const location = useLocation();
    const user = location.state.user;

    return (
        <DashboardContext.Provider value={ user }>
            <div className="app">
                <main className="content">
                    {/* Dashboard header */}
                    <header className={styles.content_head}>
                        <h1>Dashboard</h1>
                    </header>
                    {/* Main sections */}
                    <div className={styles.content}>
                        {/* Section about money data */}
                        <section className={styles.info_boxes}>
                            <div className={styles.info_box}>
                                {/* Payment icon */}
                                <div className={styles.box_icon}>
                                    <PaymentOutlineIcon />
                                </div>
                                <div className={styles.box_content}>
                                    <span className={styles.big}>
                                        {user.TotalSpent}
                                    </span>
                                </div>
                            </div>
                        </section>
                    </div>
                </main>
            </div>
        </DashboardContext.Provider>
    );
}

export default Dashboard;
