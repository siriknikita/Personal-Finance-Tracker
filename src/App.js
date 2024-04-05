import { Routes, Route, Navigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import Topbar from "./client/scenes/global/Topbar";
import Sidebar from "./client/scenes/global/Sidebar";
import axios from "axios";
import Login from "./client/scenes/login";
import Signup from "./client/scenes/signup";
import Dashboard from "./client/scenes/dashboard";
import PieChart from "./client/components/PieChart";

async function getUser(email) {
    try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/get/user/email/${email}`);
        return response.data.user;
    } catch (error) {
        throw new Error(`Error loading data: ${error}`);
    }
}

function App() {
    const [user, setUser] = useState(null);
    const [isRegistered, setIsRegistered] = useState(false);
    const [theme, colorMode] = useMode();
    const [isSidebar, setIsSidebar] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!isRegistered) {
                setUser(null)
                setIsRegistered(false);
            } else {
                const userData = await getUser();
                setUser(userData);
                setIsRegistered(true);
            }
        };
        fetchData();
    }, [isRegistered]);

    return (
        <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <div className="app">
                    <Sidebar isSidebar={isSidebar} />
                    <main className="content">
                        <Topbar setIsSidebar={setIsSidebar} />
                        <Routes>
                            <Route
                                exact
                                path="/login"
                                element={user ? <Navigate to="/dashboard" /> : <Login />}
                            />
                            <Route
                                path="/signup"
                                element={user ? <Navigate to="/" /> : <Signup />}
                            />
                            <Route
                                path="/dashboard"
                                element={user ? <Dashboard user={user} /> : <Dashboard />}
                            />
                            <Route
                                path="/pie"
                                element={<PieChart userID={user?.UserID}/>}
                            />
                        </Routes>
                    </main>
                </div>
            </ThemeProvider>
        </ColorModeContext.Provider>
    );
}

export default App;
