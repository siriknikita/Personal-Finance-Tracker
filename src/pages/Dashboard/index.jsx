import styles from "./styles.module.css";
import { useEffect, useState } from "react";
import { useLocation } from 'react-router-dom'
import Popup from "../../components/Popup";
import PlotStatistics from "../../components/Plot";
import ToggleDisplay from "react-toggle-display";

function Dashboard() {
    const location = useLocation();
    const email = location.state.userEmail;
    const [ user, setUser ] = useState({});
    
    const [ currentAmount, setCurrentAmount ] = useState(0.0);
    const [ currentCategoryID, setCurrentCategoryID ] = useState(1);

    const [ moneySpent, setMoneySpent ] = useState([]);
    const [ transactionCategories, setTransactionCategories ] = useState({});
    const [ showDashboard, setShowDashboard ] = useState(true)
    const [ isOpen, setIsOpen ] = useState(false);

    const getUserByEmail = async (givenEmail) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/get/user/email/${givenEmail}`);
            const user = await response.json();
            console.log("User retrieved successfully:", user);
            return user;
        } catch (error) {
            console.error("Error retrieving user:", error);
        }
    };
    
    useEffect(() => {
        const fetchUser = async () => {
            const fetchedUser = await getUserByEmail(email);
            setUser(fetchedUser);
        };
        fetchUser();
    }, [email]);

    const getTransactionCategoriesByEmail = async (givenEmail) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/get/transactions/categories/${givenEmail}`);
            if (response.ok) {
                const categories = await response.json();
                console.log("Categories retrieved successfully:");
                console.log(categories);
                return categories;
            } else {
                console.log("Error retrieving transactions");
            }
        } catch (error) {
            console.error("Error retrieving transactions:", error);
        }
    };

    useEffect(() => {
        const fetchCategories = async () => {
            const fetchedCategories = await getTransactionCategoriesByEmail(email);
            setTransactionCategories(fetchedCategories)
        };
        fetchCategories();
    }, [email]);

    const getMoneySpentByEmail = async (givenEmail) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/get/transactions/moneySpent/${givenEmail}`);
            const moneyRetrieved = await response.json();
            console.log("Money retrieved successfully:", moneyRetrieved);
            return moneyRetrieved;
        } catch (error) {
            console.error("Error retrieving money:", error);
        }
    };
    
    useEffect(() => {
        const fetchMoney = async () => {
            const fetchedMoney = await getMoneySpentByEmail(email);
            setMoneySpent(fetchedMoney);
        };
        fetchMoney();
    }, [email]);
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/add/transaction`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, currentAmount, currentCategoryID }),
            });
            if (response) {
                console.log("Transaction added successfully!");
                const responseCategory = await fetch(`${process.env.REACT_APP_API_URL}/api/get/categoryName/${currentCategoryID}`);
                const currentCategoryObj = await responseCategory.json();
                const currentCategoryName = currentCategoryObj['categoryName']
                setMoneySpent([...moneySpent, currentAmount]);
                setTransactionCategories([...transactionCategories, currentCategoryName]);
                setIsOpen(false);
                setShowDashboard(true);
            } else {
                console.error("Transaction adding failed:", await response.text());
            }
        } catch (error) {
            console.error("Error adding a new transaction:", error);
        }
    };

    const handlePopupSubmit = () => {
        setShowDashboard(false)
        setIsOpen(true)
    };

    const handleClose = () => {
        setIsOpen(false)
        setShowDashboard(true)
    };

    return (
    <div className={styles.dashboard}>
        <header className={styles.menu_wrap}>
            {/* User info */}
            <figure className={styles.user}>
                <div className={styles.user_avatar}>
                </div>
                <figcaption>{user.Username}</figcaption>
            </figure>
            <nav>
            {/* Discover categoryd */}
            <section className={styles.discover}>
                <h3>Discover</h3>
                <ul>
                <li>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={24}
                        height={24}
                        viewBox="0 0 24 24"
                    >
                        <path d="M20.205 4.791a5.938 5.938 0 0 0-4.209-1.754A5.906 5.906 0 0 0 12 4.595a5.904 5.904 0 0 0-3.996-1.558 5.942 5.942 0 0 0-4.213 1.758c-2.353 2.363-2.352 6.059.002 8.412l7.332 7.332c.17.299.498.492.875.492a.99.99 0 0 0 .792-.409l7.415-7.415c2.354-2.353 2.355-6.049-.002-8.416zm-1.412 7.002L12 18.586l-6.793-6.793c-1.562-1.563-1.561-4.017-.002-5.584.76-.756 1.754-1.172 2.799-1.172s2.035.416 2.789 1.17l.5.5a.999.999 0 0 0 1.414 0l.5-.5c1.512-1.509 4.074-1.505 5.584-.002 1.563 1.571 1.564 4.025.002 5.588z" />
                    </svg>
                    Most popular
                </li>
                <li>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={24}
                        height={24}
                        viewBox="0 0 24 24"
                    >
                        <path d="M12.707 2.293A.996.996 0 0 0 12 2H3a1 1 0 0 0-1 1v9c0 .266.105.52.293.707l9 9a.997.997 0 0 0 1.414 0l9-9a.999.999 0 0 0 0-1.414l-9-9zM12 19.586l-8-8V4h7.586l8 8L12 19.586z" />
                        <circle cx="7.507" cy="7.505" r="1.505" />
                    </svg>
                    Categories
                </li>
                </ul>
            </section>
            {/* Tools */}
            <section className={styles.tools}>
                <h3>Tools</h3>
                {/* List of tools */}
                <ul>
                    {/* Search option */}
                    <li>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width={24}
                            height={24}
                            viewBox="0 0 24 24"
                        >
                            <path d="M10 18a7.952 7.952 0 0 0 4.897-1.688l4.396 4.396 1.414-1.414-4.396-4.396A7.952 7.952 0 0 0 18 10c0-4.411-3.589-8-8-8s-8 3.589-8 8 3.589 8 8 8zm0-14c3.309 0 6 2.691 6 6s-2.691 6-6 6-6-2.691-6-6 2.691-6 6-6z" />
                        </svg>
                        Search
                    </li>
                    {/* Messaging option */}
                    <li>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width={24}
                            height={24}
                            viewBox="0 0 24 24"
                        >
                            <path d="M21 4H3a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1zm-1 14H4V9.227l7.335 6.521a1.003 1.003 0 0 0 1.33-.001L20 9.227V18zm0-11.448l-8 7.11-8-7.111V6h16v.552z" />
                        </svg>
                        Messages
                    </li>
                    {/* Adding transaction option */}
                    <li>
                        <svg 
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            class="bi bi-plus-circle"
                            viewBox="0 0 16 16">
                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                        </svg>
                        <button onClick={handlePopupSubmit}>Add transaction</button>
                        {/* Define a popup menu to prompt user to enter an amount of money he spent on a category */}
                        <Popup trigger={isOpen} setTrigger={setIsOpen} onClose={handleClose}>
                            <h3>Add a new transaction!</h3>
                            <form onSubmit={handleSubmit}>
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
        <main className={styles.content_wrap}>
            <header className={styles.content_head}>
                <h1>Dashboard</h1>
            </header>
            <div className={styles.content}>
            <section className={styles.info_boxes}>
                <div className={styles.info_box}>
                    <div className={styles.box_icon}>
                        <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={24}
                        height={24}
                        viewBox="0 0 24 24"
                        >
                        <path d="M21 20V4a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1zm-2-1H5V5h14v14z" />
                        <path d="M10.381 12.309l3.172 1.586a1 1 0 0 0 1.305-.38l3-5-1.715-1.029-2.523 4.206-3.172-1.586a1.002 1.002 0 0 0-1.305.38l-3 5 1.715 1.029 2.523-4.206z" />
                        </svg>
                    </div>
                    <div className={styles.box_content}>
                        <span className={styles.big}>
                            {user["TotalSpent"]}
                        </span>
                        Money spent total ($)
                    </div>
                </div>
                <div className={styles.info_box}>
                    <div className={styles.box_icon}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path d="M14,11H10a2,2,0,0,1,0-4h5a1,1,0,0,1,1,1,1,1,0,0,0,2,0,3,3,0,0,0-3-3H13V3a1,1,0,0,0-2,0V5H10a4,4,0,0,0,0,8h4a2,2,0,0,1,0,4H9a1,1,0,0,1-1-1,1,1,0,0,0-2,0,3,3,0,0,0,3,3h2v2a1,1,0,0,0,2,0V19h1a4,4,0,0,0,0-8Z" />
                        </svg>
                    </div>
                    <div className={styles.box_content}>
                        <span className={styles.big}>{user.WeeklySpent}</span>
                        Money spent (this week)
                    </div>
                </div>
            </section>
            <ToggleDisplay show={showDashboard}>
                <PlotStatistics showDashboard={showDashboard} categories={transactionCategories} moneySpent={moneySpent} />
            </ToggleDisplay>
            </div>
        </main>
    </div>
    )
}

export default Dashboard;
