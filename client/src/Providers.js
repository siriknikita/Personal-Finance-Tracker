import { GoogleOAuthProvider } from "@react-oauth/google";
import React, { useEffect, useState } from "react";
import CookieConsent from "react-cookie-consent";
import AuthorizedThemeProvider from "./AuthorizedThemeProvider";
import { Notification } from "./components";
import { UserContext } from "./contexts";
import { useMode } from "./theme";
import CookieConsentInfo from "./ui/cookieConsentInfo";

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

  const handleClick = () => {
    document.getElementById("cookie-consent").showModal();
  };

  return (
    <UserContext.Provider
      value={{ user, setUser, isAuthorized, setIsAuthorized }}
    >
      <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
        <AuthorizedThemeProvider theme={theme} colorMode={colorMode}>
          <Notification />
          {children}
          <CookieConsent>
            This website uses cookies. See our{" "}
            <button className="text-blue-300" onClick={handleClick}>
              privacy policy
            </button>{" "}
            for more.
            <dialog
              id="cookie-consent"
              className="modal modal-bottom sm:modal-middle"
            >
              <div className="modal-box">
                <h3 className="font-bold text-lg">Cookies Policy</h3>
                <p className="py-4">
                  Press ESC key or click the button below to close
                </p>
                <CookieConsentInfo />
                <div className="modal-action">
                  <form method="dialog">
                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                      ✕
                    </button>
                    <button className="btn">Close</button>
                  </form>
                </div>
              </div>
            </dialog>
          </CookieConsent>
        </AuthorizedThemeProvider>
      </GoogleOAuthProvider>
    </UserContext.Provider>
  );
}

export default Providers;
