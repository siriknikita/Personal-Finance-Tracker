import React from "react";
import { Helmet } from "react-helmet";
import { BehaviourBarChart, Header } from "../../components";
import styles from "./styles.module.css";

function AdminDashboard() {
  return (
    <>
      <Helmet>
        <title>Admin Dashboard</title>
      </Helmet>
      <Header title="Dashboard" subtitle="Welcome to your admin dashboard" />
      <div className={styles.content}>
        <section className={styles.info_boxes}>
          <div className={styles.info_box}>
            <>
              <h2>Users' behaviour</h2>
              <BehaviourBarChart />
            </>
          </div>
        </section>
      </div>
    </>
  );
}

export default AdminDashboard;
