import { Reorder } from "framer-motion";
import React, { useContext, useState } from "react";
import { Helmet } from "react-helmet";
import {
  CategoriesPieChart,
  Header,
  Table,
  TransactionsTable,
} from "../../components";
import ExpenseChart from "../../components/ExpenseChart";
import { UserContext } from "../../contexts";

function Dashboard() {
  const { user } = useContext(UserContext);
  const [items, setItems] = useState([
    {
      id: "spendings",
      content: <CategoriesPieChart userID={user.userID} />,
      title: "Your Spendings",
    },
    {
      id: "transactions",
      content: <TransactionsTable />,
      title: "Your Transactions",
    },
    {
      id: "goals",
      content: (
        <Table
          fetchUrl={`goals/get/${user.userID}`}
          dataKey={"goals"}
          columnsAccessors={["description", "deadline"]}
        />
      ),
      title: "Your Goals",
    },
  ]);

  return (
    <>
      <Helmet>
        <title>Dashboard</title>
      </Helmet>
      <Header title="Dashboard" subtitle="Welcome to your dashboard" />
      <div className="bg-alice-blue w-[100%] h-[56%] flex justify-start items-center flex-wrap ">
        {/* Upper section */}
        <Reorder.Group
          axis="x"
          onReorder={setItems}
          values={items}
          className="flex flex-row gap-4 ml-4 mb-1"
        >
          {items.map((item) => (
            <Reorder.Item
              key={item.id}
              value={item}
              className="flex flex-col items-center max-h-[300px] justify-center border border-solid rounded-md border-gray-200"
            >
              <h2 className="text-2xl font-bold">{item.title}</h2>
              {item.content}
            </Reorder.Item>
          ))}
        </Reorder.Group>
        {/* Chart section */}
        <div className="w-[99%] border border-solid rounded-md border-gray-200 m-4">
          <ExpenseChart userID={user.userID} />
        </div>
      </div>
    </>
  );
}

export default Dashboard;
