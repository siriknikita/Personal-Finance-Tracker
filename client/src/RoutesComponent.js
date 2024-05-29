import React, { useContext } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { UserContext } from "./contexts";
import { Table, TransactionsTable } from "./components";
import { AdminDashboard, Dashboard, Login, Profile, Signup } from "./scenes";
import { GoalForm, ProfileForm, TransactionForm } from "./scenes/forms";

const RoutesComponent = () => {
  const { user } = useContext(UserContext);
  const isAuthorized =
    useContext(UserContext).isAuthorized ||
    localStorage.getItem("isAuthorized") === "true";

  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to={isAuthorized ? "/dashboard" : "/login"} />}
      />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      {isAuthorized && (
        <>
          <Route path="/dashboard" element={<Dashboard user={user} />} />
          <Route path="/adminDashboard" element={<AdminDashboard />} />
          <Route path="/transactionForm" element={<TransactionForm />} />
          <Route path="/profileForm" element={<ProfileForm />} />
          <Route path="/goalForm" element={<GoalForm />} />
          <Route
            path="/goals"
            element={
              <Table
                fetchUrl={`goals/get/${user.userID}`}
                dataKey={"goals"}
                columnsAccessors={["description", "deadline"]}
              />
            }
          />
          <Route path="/profile" element={<Profile />} />
          <Route path="/transactions" element={<TransactionsTable />} />
        </>
      )}
    </Routes>
  );
};

export default RoutesComponent;
