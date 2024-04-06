import { CssBaseline, ThemeProvider } from "@mui/material";
import React, { useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Sidebar from "./scenes/global/Sidebar";
import Topbar from "./scenes/global/Topbar";
import Login from "./scenes/login";
import PieChart from "./components/PieChart";
import Signup from "./scenes/signup";
import Dashboard from "./scenes/dashboard";
import { ColorModeContext, useMode } from "./theme";

function App() {
    const [user, setUser] = useState(null);
    const [theme, colorMode] = useMode();
    const [isSidebar, setIsSidebar] = useState(true);

    return (
        <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <div className="app">
                    {user ? (
                        <div className="app__container">
                            <Topbar
                                isSidebar={isSidebar}
                                setIsSidebar={setIsSidebar}
                                user={user}
                            />
                            <Sidebar isSidebar={isSidebar} user={user} />
                            <Routes>
                                <Route
                                    path="/"
                                    element={<Navigate to="/dashboard" />}
                                />
                                <Route
                                    path="/dashboard"
                                    element={<Dashboard user={user} />}
                                />
                                <Route
                                    path="/piechart"
                                    element={<PieChart userID={user.UserID} />}
                                />
                            </Routes>
                        </div>
                    ) : (
                        <Routes>
                            <Route path="/" element={<Navigate to="/login" />} />
                            <Route path="/login" element={<Login setUser={setUser} />} />
                            <Route path="/signup" element={<Signup />} />
                        </Routes>
                    )}
                </div>
            </ThemeProvider>
        </ColorModeContext.Provider>
    );
}

export default App;
