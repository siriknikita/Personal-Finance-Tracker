import styles from "./styles.module.css";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Popup from "../../components/Popup";
import PlotStatistics from "../../components/Plot";
import ToggleDisplay from "react-toggle-display";
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import AccountCircleOutlineIcon from '@mui/icons-material/AccountCircleOutlined'
import PaymentOutlineIcon from '@mui/icons-material/PaymentOutlined'

async function fetchData(url) {
    try {
        let response = await fetch(url);
        let data = await response.json();
        return data;
    } catch (error) {
        throw new Error('Error loading data');
    }
}

function Dashboard() {
    const location = useLocation();
    const email = location.state.userEmail;
    const [ user, setUser ] = useState({});
    const [ userID, setUserID ] = useState(1);
    
    // Control transaction variables
    const [ currentAmount, setCurrentAmount ] = useState(0.0);
    const [ currentCategoryID, setCurrentCategoryID ] = useState(1);
    const [ moneySpent, setMoneySpent ] = useState([]);
    const [ totalSpent, setTotalSpent ] = useState(0.00);
    const [ transactionCategories, setTransactionCategories ] = useState({});

    // Control display variables
    const [ showDashboard, setShowDashboard ] = useState(true);
    const [ isOpen, setIsOpen ] = useState(false);
    const [ transactions, setTransactions ] = useState([]);

    // Get and set user
    useEffect(() => {
        const fetchedUser = fetchData(`/api/get/user/email/${email}`);
        const userObj = fetchedUser.user;
        const userID = userObj.UserID;
        const totalSpent = userObj.TotalSpent;
        setUser(userObj);
        setUserID(userID);
        setTotalSpent(totalSpent);
    }, []);

    // Get and set transaction categories
    useEffect(() => {
        const fetchedTransactionCategories = fetchData(`/api/get/transactions/categories/${userID}`);
        setTransactionCategories(fetchedTransactionCategories);
    }, []);

    // Get and set money spent
    useEffect(() => {
        const fetchedMoneySpent = fetchData(`/api/get/transactions/moneySpent/${userID}`);
        setMoneySpent(fetchedMoneySpent);
    }, []);
    
    // Get and set transactions
    useEffect(() => {
        const fetchedTransactions = fetchData(`/api/get/transactions/${userID}`);
        setTransactions(fetchedTransactions);
    }, []);

    const handlePopupSubmit = () => {
        setShowDashboard(false);
        setIsOpen(true);
    };

    const handleClose = () => {
        setShowDashboard(true);
        setIsOpen(false);
    };

    const handleAddMoneyFormSubmit = async (e) => {
        e.preventDefault();
        try {
            // fetch adding transaction route
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/add/transaction`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userID: userID,
                    currentAmount: currentAmount,
                    currentCategoryID: currentCategoryID
                }),
            });
            if (response) {
                // get category name by it's id
                const currentCategoryObj = fetchData(`/api/get/categoryName/${currentCategoryID}`);
                const currentCategoryName = currentCategoryObj.categoryName;
                
                // get updated total spent variable
                const totalSpentObj = fetchData(`/api/get/totalSpent/${userID}`);
                const updatedTotalSpent = totalSpentObj.totalSpent;

                const currentDate = new Date();
                const timestamp = currentDate.getTime();
                
                setMoneySpent([...moneySpent, currentAmount]);
                setTransactionCategories([...transactionCategories, currentCategoryName]);
                setTotalSpent(updatedTotalSpent);
                setTransactions([...transactions, {
                    TransactionID: transactions[-1].TransactionID + 1,
                    Amount: currentAmount,
                    CategoryID: currentCategoryID,
                    TransactionDate: timestamp,
                }])
                handleClose();
            } else {
                console.error("Transaction adding failed:", await response.text());
            }
        } catch (error) {
            handleClose();
            console.error("Error adding a new transaction:", error);
        }
    };

    return (
        <div className={styles.dashboard}>
            {/* Menu */}
            <header className={styles.menu_wrap}>
                {/* User info */}
                <figure className={styles.user}>
                    {/* Account icon */}
                    <div className={styles.user_avatar}>
                        <AccountCircleOutlineIcon />
                    </div>
                    {/* Username and Email */}
                    <figcaption>
                        {user.Username}
                        <br />
                        <div className={styles.user_email}>
                            {user.Email}
                        </div>
                    </figcaption>
                </figure>
                {/* Tools */}
                <nav>
                    <section className={styles.tools}>
                        <h3>Tools</h3>
                        {/* List of tools */}
                        <ul>
                            {/* Search option */}
                            <li>
                                <SearchOutlinedIcon />
                                Search
                            </li>
                            {/* Adding transaction option */}
                            <li>
                                <AddCircleOutlineIcon />
                                <button onClick={handlePopupSubmit}>Add transaction</button>
                                {/* Define a popup menu to prompt user to enter an amount of money he spent on a category */}
                                <Popup trigger={isOpen} setTrigger={setIsOpen} onClose={handleClose}>
                                    <h3>Add a new transaction!</h3>
                                    <form onSubmit={handleAddMoneyFormSubmit}>
                                        {/* Enter amount of money */}
                                        <label>
                                            Enter amount of money ($):
                                            <input 
                                                type="number"
                                                className={styles.input}
                                                placeholder="Amount"
                                                value={currentAmount}
                                                onChange={(e) => setCurrentAmount(e.target.value)}
                                                required
                                            />
                                        </label>
                                        <br />
                                        {/* Choose a category */}
                                        <label>
                                            Choose a category:
                                            <select 
                                                value={currentCategoryID}
                                                onChange={(e) => setCurrentCategoryID(e.target.value)}
                                            >
                                                <option value="1">Groceries</option>
                                                <option value="2">Utilities</option>
                                                <option value="3">Rent</option>
                                                <option value="4">Entertainment</option>
                                                <option value="5">Healthcare</option>
                                                <option value="6">Transportation</option>
                                                <option value="7">Other</option>
                                            </select>
                                        </label>
                                        <br />
                                        <br />
                                        <button className={styles.btn}>Submit</button>
                                    </form>
                                </Popup>
                            </li>
                        </ul>
                    </section>
                </nav>
            </header>
            {/* Main part of dashboard */}
            <main className={styles.content_wrap}>
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
                                Money spent total ($)
                            </div>
                        </div>
                        <ToggleDisplay show={showDashboard}>
                            <PlotStatistics showDashboard={showDashboard} categories={transactionCategories} moneySpent={moneySpent} />
                        </ToggleDisplay>
                    </section>
                    {/* Section about transactions data */}
                    <section>
                        {/* Table with transactions data */}
                        <table>
                            {/* Table headers */}
                            <thead>
                                <tr>
                                    <th>TransactionID</th>
                                    <th>Amount</th>
                                    <th>CategoryID</th>
                                    <th>TransactionDate</th>
                                </tr>
                            </thead>
                            {/* Table body */}
                            <tbody>
                                {/* The key is required for each mapped element in React lists */}
                                {transactions.map((transaction) => (
                                    <tr key={transaction.TransactionID}> {/* Use TransactionID as the unique key */}
                                        <td>{transaction.TransactionID}</td>
                                        <td>{transaction.Amount}</td>
                                        <td>{transaction.CategoryID}</td>
                                        <td>{transaction.TransactionDate}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </section>
                </div>
            </main>
        </div>
    );
}

export default Dashboard;
