import React from "react";

const AuthContext = React.createContext({
  loginWithRedirect: () => {},
  logout: () => {},
  getAccessTokenSilently: async () => {},
  user: {},
  isAuthenticated: false,
  loginWithPopup: () => {},
  analysisSet: [],
  setAnalysisSet: () => {},
});

export default AuthContext;
