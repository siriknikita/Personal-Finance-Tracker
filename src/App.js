import { Routes, Route, Navigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import Topbar from "./client/scenes/global/Topbar";
import Sidebar from "./client/scenes/global/Sidebar";
import axios from "axios";
import Home from "./client/scenes/home";
import Login from "./client/scenes/login";
import Signup from "./client/scenes/signup";
import Dashboard from "./client/scenes/dashboard";

async function getUser() {
    try {
        const url = `${process.env.REACT_APP_API_URL}/auth/login/success`;
        const { data } = await axios.get(url, { withCredentials: true });
        return data.user._json;
    } catch (err) {
        console.log(err);
        return null;
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
    }, []);

    return ( user ? (
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
                                element={user ? <Navigate to="/login" /> : <Login />}
                            />
                            <Route
                                path="/dashboard"
                                element={<Dashboard />}
                            />
                        </Routes>
                    </main>
                </div>
            </ThemeProvider>
        </ColorModeContext.Provider>) : (
            <div className="container">
                <Routes>
                    <Route
                        exact
                        path="/"
                        element={user ? <Home user={user} /> : <Navigate to="/login" />}
                    />
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
                </Routes>
            </div>
        )
    );
}

export default App;
