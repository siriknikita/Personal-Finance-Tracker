import React, { useContext } from "react";
import { Helmet } from "react-helmet";
import { CategoriesPieChart, Header } from "../../components";
import { UserContext } from "../../contexts";

function Dashboard() {
  const { user } = useContext(UserContext);

  return (
    <>
      <Helmet>
        <title>Dashboard</title>
      </Helmet>
      <Header title="Dashboard" subtitle="Welcome to your dashboard" />
      <div
        className="bg-alice-blue flex justify-start items-center flex-wrap"
        // style="align-content: flex-start;"
      >
        <section
          className="py-12 pb-8 grid gap-6"
          // style="grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));"
        >
          <div className="h-40 flex items-center justify-center px-12 rounded">
            {/* <div className="block fill-current text-gray-400"> */}
              <CategoriesPieChart userID={user.userID} />
            {/* </div> */}
          </div>
        </section>
      </div>
    </>
  );
}

export default Dashboard;
