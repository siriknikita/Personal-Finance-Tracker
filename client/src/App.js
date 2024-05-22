import { CssBaseline, ThemeProvider } from "@mui/material";
import { GoogleOAuthProvider } from "@react-oauth/google";
import React, { createContext, useState } from "react";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import Notification from "./components/Notification";
import Table from "./components/Table";
import TransactionsTable from "./components/TransactionTable/TransactionsTable";
import AdminDashboard from "./scenes/adminDashboard";
import Dashboard from "./scenes/dashboard";
import GoalForm from "./scenes/forms/goalForm";
import ProfileForm from "./scenes/forms/profileForm";
import TransactionForm from "./scenes/forms/transactionsForm";
import Sidebar from "./scenes/global/Sidebar";
import Topbar from "./scenes/global/Topbar";
import Login from "./scenes/login";
import Profile from "./scenes/profile";
import Signup from "./scenes/signup";
import { ColorModeContext, useMode } from "./theme";

// TODO: Move context and associated stuff into separate component to avoid circular dependency

// Move context to another file

export const UserContext = createContext(null);

function App() {
  const [user, setUser] = useState(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);

  // TODO: Move router into separate  component
  // Need to move router to another component

  return (
    <UserContext.Provider value={{ user, setUser, setIsAuthorized }}>
      <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
        <ColorModeContext.Provider value={colorMode}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Router>
              <Notification />
              <div className="app">
                <Routes>
                  <Route path="/" element={<Navigate to="/login" />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/login" element={<Login setUser={setUser} />} />
                </Routes>
                {isAuthorized && (
                  <>
                    <Sidebar isSidebar={isSidebar} />
                    <main className="content">
                      <Topbar setIsSidebar={setIsSidebar} />
                      <Routes>
                        <>
                          <Route
                            path="/dashboard"
                            element={<Dashboard user={user} />}
                          />
                          <Route
                            path="/adminDashboard"
                            element={<AdminDashboard />}
                          />
                          <Route
                            path="/transactionForm"
                            element={<TransactionForm />}
                          />
                          <Route
                            path="/profileForm"
                            element={<ProfileForm />}
                          />
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
                          <Route
                            path="/transactions"
                            element={<TransactionsTable />}
                          />
                        </>
                      </Routes>
                    </main>
                  </>
                )}
              </div>
            </Router>
          </ThemeProvider>
        </ColorModeContext.Provider>
      </GoogleOAuthProvider>
    </UserContext.Provider>
  );
}

export default App;
