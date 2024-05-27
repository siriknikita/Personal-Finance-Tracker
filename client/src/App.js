import { GoogleOAuthProvider } from "@react-oauth/google";
import React, { createContext, useEffect, useState } from "react";
import AuthorizedThemeProvider from "./AuthorizedThemeProvider";
import RoutesComponent from "./RoutesComponent";
import {Notification} from "./components";
import { Sidebar, Topbar } from "./scenes/global";
import { useMode } from "./theme";

export const UserContext = createContext(null);

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [isAuthorized, setIsAuthorized] = useState(() => {
    const savedIsAuthorized = localStorage.getItem("isAuthorized");
    return savedIsAuthorized === "true";
  });
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem("isAuthorized", isAuthorized);
  }, [isAuthorized]);

  return (
    <UserContext.Provider
      value={{ user, setUser, isAuthorized, setIsAuthorized }}
    >
      <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
        <AuthorizedThemeProvider theme={theme} colorMode={colorMode}>
          <Notification />
          <div className="app">
            {isAuthorized && <Sidebar isSidebar={isSidebar} />}
            <main className="content">
              {isAuthorized && <Topbar setIsSidebar={setIsSidebar} />}
              <RoutesComponent />
            </main>
          </div>
        </AuthorizedThemeProvider>
      </GoogleOAuthProvider>
    </UserContext.Provider>
  );
}

export default App;
