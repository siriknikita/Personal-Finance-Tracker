import React, { createContext, useContext, useState } from "react";
import { Helmet } from "react-helmet";
import { CategoriesPieChart, Header, PieChartSkeleton } from "../../components";
import { UserContext } from "../../contexts";

export const LoadingContext = createContext(null);

function Dashboard() {
  const { user } = useContext(UserContext);
  const [showPieChart, setShowPieChart] = useState(false);

  return (
    <>
      <Helmet>
        <title>Dashboard</title>
      </Helmet>
      <Header title="Dashboard" subtitle="Welcome to your dashboard" />
      <div
        class="bg-alice-blue flex justify-start items-center flex-wrap"
        // style="align-content: flex-start;"
      >
        <section
          className="py-12 pb-8 grid gap-8"
          // style="grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));"
        >
          <div class="bg-white h-40 flex items-center justify-start px-12 border border-gray-200 rounded">
            <div class="block w-12 h-12 fill-current text-gray-400">
              <LoadingContext.Provider value={{ setShowPieChart }}>
                {!showPieChart && <PieChartSkeleton />}
                <CategoriesPieChart userID={user.userID} />
              </LoadingContext.Provider>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default Dashboard;
