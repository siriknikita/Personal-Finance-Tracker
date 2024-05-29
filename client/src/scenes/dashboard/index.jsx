import React, { createContext, useContext, useState } from "react";
import { Helmet } from "react-helmet";
import { UserContext } from "../../contexts";
import { CategoriesPieChart, Header, PieChartSkeleton } from "../../components";
import styles from "./styles.module.css";

export const LoadingContet = createContext(null);

function Dashboard() {
  const { user } = useContext(UserContext);
  const [showPieChart, setShowPieChart] = useState(false);

  return (
    <>
      <Helmet>
        <title>Dashboard</title>
      </Helmet>
      <Header title="Dashboard" subtitle="Welcome to your dashboard" />
      <div className={styles.content}>
        <section className={styles.info_boxes}>
          <div className={styles.info_box}>
            <LoadingContet.Provider value={{ setShowPieChart }}>
              {!showPieChart && <PieChartSkeleton />}
              <CategoriesPieChart userID={user.userID} />
            </LoadingContet.Provider>
          </div>
        </section>
      </div>
    </>
  );
}

export default Dashboard;
