import styles from "./styles.module.css";
import { useLocation } from "react-router-dom";
import React, { useLayoutEffect, useState, createContext } from "react";
import PaymentOutlineIcon from '@mui/icons-material/PaymentOutlined'

export const DashboardContext = createContext();

async function fetchData(url) {
    console.log(url);
    try {
        let response = await fetch(`${process.env.REACT_APP_API_URL}/api/${url}`);
        let data = await response.json();
        console.log("Data:");
        console.log(data);
        return data;
    } catch (error) {
        throw new Error(`Error loading data: ${error}`);
    }
}

async function getUser(email) {
    try {
        const response = await fetchData(`get/user/email/${email}`);
        return response.user;
    } catch (error) {
        throw new Error(`Error loading data: ${error}`);
    }
}

function Dashboard() {
    const location = useLocation();
    const email = location.state.userEmail;
    const [ user, setUser ] = useState({});
    // const [ userID, setUserID ] = useState(1);
    
    // Control transaction variables
    const [ totalSpent, setTotalSpent ] = useState(0.00);

    // Get and set user
    useLayoutEffect(() => {
        const fetchedUser = getUser(email);
        setUser(fetchedUser);
        const totalSpent = fetchData(`get/totalSpent/${fetchedUser.userID}`);
        setTotalSpent(totalSpent.totalSpent);
    }, [email]);

    // const handleAddMoneyFormSubmit = async (e) => {
    //     e.preventDefault();
    //     try {
    //         const response = await fetch(`${process.env.REACT_APP_API_URL}/api/add/transaction`, {
    //             method: "POST",
    //             headers: {
    //                 "Content-Type": "application/json",
    //             },
    //             body: JSON.stringify({
    //                 userID: userID,
    //                 currentAmount: currentAmount,
    //                 currentCategoryID: currentCategoryID
    //             }),
    //         });
    //         if (response) {
    //             const currentCategoryObj = fetchData(`/api/get/categoryName/${currentCategoryID}`);
    //             const currentCategoryName = currentCategoryObj.categoryName;
                
    //             // get updated total spent variable
    //             const totalSpentObj = fetchData(`/api/get/totalSpent/${userID}`);
    //             const updatedTotalSpent = totalSpentObj.totalSpent;

    //             const currentDate = new Date();
    //             const timestamp = currentDate.getTime();
                
    //             setMoneySpent([...moneySpent, currentAmount]);
    //             setTransactionCategories([...transactionCategories, currentCategoryName]);
    //             setTotalSpent(updatedTotalSpent);
    //             setTransactions([...transactions, {
    //                 TransactionID: transactions[-1].TransactionID + 1,
    //                 Amount: currentAmount,
    //                 CategoryID: currentCategoryID,
    //                 TransactionDate: timestamp,
    //             }])
    //             handleClose();
    //         } else {
    //             console.error("Transaction adding failed:", await response.text());
    //         }
    //     } catch (error) {
    //         handleClose();
    //         console.error("Error adding a new transaction:", error);
    //     }
    // };

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
                                        {totalSpent}
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
