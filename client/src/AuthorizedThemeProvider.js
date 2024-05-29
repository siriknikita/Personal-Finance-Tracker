import { CssBaseline, ThemeProvider } from "@mui/material";
import React, { useContext, useState } from "react";
import { UserContext } from "./contexts";
import { Sidebar, Topbar } from "./scenes/global";
import { ColorModeContext, useMode } from "./theme";

const AuthorizedThemeProvider = ({ children }) => {
  const { isAuthorized } = useContext(UserContext);
  const [isSidebar, setIsSidebar] = useState(true);
  const [theme, colorMode] = useMode();

  if (!isAuthorized) {
    return children;
  }

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <Sidebar isSidebar={isSidebar} isAuthorized={isAuthorized} />
          <main className="content">
            <Topbar setIsSidebar={setIsSidebar} isAuthorized={isAuthorized} />
            {children}
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default AuthorizedThemeProvider;
