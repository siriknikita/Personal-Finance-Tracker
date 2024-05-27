import { CssBaseline, ThemeProvider } from "@mui/material";
import React, { useContext } from "react";
import { UserContext } from "./App";
import { ColorModeContext } from "./theme";

const AuthorizedThemeProvider = ({ colorMode, theme, children }) => {
  const { isAuthorized } = useContext(UserContext);

  if (!isAuthorized) {
    return children;
  }

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default AuthorizedThemeProvider;
