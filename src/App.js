import { Routes, Route, Navigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import axios from "axios";
import Home from "./scenes/home";
import Login from "./scenes/login";
import Signup from "./scenes/signup";
import Dashboard from "./scenes/dashboard";

function App() {
    const [user, setUser] = useState(null);
    const [theme, colorMode] = useMode();
    const [isSidebar, setIsSidebar] = useState(true);

    const getUser = async () => {
        try {
            const url = `${process.env.REACT_APP_API_URL}/auth/login/success`;
            const { data } = await axios.get(url, { withCredentials: true });
            setUser(data.user._json);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        getUser();
    }, []);

    return (
        <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <div>
                    <Sidebar isSidebar={isSidebar} />
                    <main>
                        <Topbar setIsSidebar={setIsSidebar} />
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
                                element={<Dashboard />}
                            />
                        </Routes>
                    </main>
                </div>
            </ThemeProvider>
        </ColorModeContext.Provider>
    );
}

export default App;
