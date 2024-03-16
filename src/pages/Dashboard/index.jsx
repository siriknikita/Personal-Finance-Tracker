import styles from "./styles.module.css";
import { useEffect, useState } from "react"
import { useLocation } from 'react-router-dom'

function Dashboard() {
    const email = useLocation();
    const [user, setUser] = useState({});

    useEffect(() => {
        fetch(`/api/get_user/${email}`)
        .then(res => res.json())
        .then(user => setUser(user))
    }, [])

    return (
            <div className={styles.dashboard}>
    <header className={styles.menu_wrap}>
        <figure className={styles.user}>
            <div className={styles.user_avatar}>
                <img src={user.picture} alt={user.Username} />
            </div>
            <figcaption>{user.Username}</figcaption>
        </figure>
        <nav>
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
        <section className={styles.tools}>
            <h3>Tools</h3>
            <ul>
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
                <span className={styles.big}>44.51</span>
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
                <span className={styles.big}>13.57</span>
                Money spent (this week)
            </div>
            </div>
            <div className={styles.info_box}>
            <div className={styles.box_icon}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                <path d="M152 24c0-13.3-10.7-24-24-24s-24 10.7-24 24V64H64C28.7 64 0 92.7 0 128v16 48V448c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V192 144 128c0-35.3-28.7-64-64-64H344V24c0-13.3-10.7-24-24-24s-24 10.7-24 24V64H152V24zM48 192H400V448c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V192z" />
                </svg>
            </div>
            <div className={styles.box_content}>
                <span className={styles.big}>18</span>
                Consistency days
            </div>
            </div>
        </section>
        </div>
    </main>
    </div>
    )
}

export default Dashboard;
