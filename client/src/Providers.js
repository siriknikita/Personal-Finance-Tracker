import { GoogleOAuthProvider } from "@react-oauth/google";
import React, { useEffect, useState } from "react";
import AuthorizedThemeProvider from "./AuthorizedThemeProvider";
import { Notification } from "./components";
import { UserContext } from "./contexts";
import { useMode } from "./theme";

function Providers({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [isAuthorized, setIsAuthorized] = useState(() => {
    return localStorage.getItem("isAuthorized") === "true";
  });
  const [theme, colorMode] = useMode();

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
          {children}
        </AuthorizedThemeProvider>
      </GoogleOAuthProvider>
    </UserContext.Provider>
  );
}

export default Providers;
