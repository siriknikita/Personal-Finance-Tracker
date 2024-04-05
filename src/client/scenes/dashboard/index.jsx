import styles from "./styles.module.css";
import { useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "../../../theme";
// import Popup from "../../components/Popup";
import Topbar from "../global/Topbar";
import Sidebar from "../global/Sidebar";
import PaymentOutlineIcon from '@mui/icons-material/PaymentOutlined'

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

function Dashboard() {
    const location = useLocation();
    const email = location.state.userEmail;
    const [ user, setUser ] = useState({});
    const [ userID, setUserID ] = useState(1);
    const [ theme, colorMode ] = useMode();
    const [ isSidebar, setIsSidebar ] = useState(true);
    
    // Control transaction variables
    // const [ currentAmount, setCurrentAmount ] = useState(0.0);
    // const [ currentCategoryID, setCurrentCategoryID ] = useState(1);
    const [ moneySpent, setMoneySpent ] = useState([]);
    const [ totalSpent, setTotalSpent ] = useState(0.00);
    const [ transactionCategories, setTransactionCategories ] = useState({});

    // Control display variables
    // const [ isOpen, setIsOpen ] = useState(false);
    // const [ transactions, setTransactions ] = useState([]);

    // Get and set user
    // eslint-disable-next-line
    useEffect(() => {
        const fetchedUser = fetchData(`get/user/email/${email}`);
        console.log("Fetched user");
        console.log(fetchedUser);
        const userObj = fetchedUser?.user;
        const userID = userObj?.UserID;
        const totalSpent = userObj?.TotalSpent;
        setUser(userObj);
        setUserID(userID);
        setTotalSpent(totalSpent);
    }, [email]);

    // Get and set transaction categories
    // eslint-disable-next-line
    useEffect(() => {
        const fetchedTransactionCategories = fetchData(`get/transactions/categories/${userID}`);
        setTransactionCategories(fetchedTransactionCategories);
    }, [userID]);

    // Get and set money spent
    // eslint-disable-next-line
    useEffect(() => {
        const fetchedMoneySpent = fetchData(`get/transactions/moneySpent/${userID}`);
        setMoneySpent(fetchedMoneySpent);
    }, [userID]);
    
    // Get and set transactions
    // useEffect(() => {
    //     const fetchedTransactions = fetchData(`/api/get/transactions/${userID}`);
    //     setTransactions(fetchedTransactions);
    // }, []);

    // const handlePopupSubmit = () => {
    //     setShowDashboard(false);
    //     setIsOpen(true);
    // };

    // const handleClose = () => {
    //     setShowDashboard(true);
    //     setIsOpen(false);
    // };

    // const handleAddMoneyFormSubmit = async (e) => {
    //     e.preventDefault();
    //     try {
    //         // fetch adding transaction route
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
    //             // get category name by it's id
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
        <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <div className="app">
                    <Sidebar isSidebar={isSidebar} user={user}/>
                    <main className="content">
                        <Topbar setIsSidebar={setIsSidebar} />
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
            </ThemeProvider>
        </ColorModeContext.Provider>
    );
}

export default Dashboard;
