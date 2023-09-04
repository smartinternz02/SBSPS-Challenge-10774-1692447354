import { useAuth0 } from "@auth0/auth0-react";
import AuthContext from "./auth-context";
import { useEffect, useState } from "react";
import { callProtectedAPI } from "../utils/callProtectedAPI";
const fetchAnalysisObject = async (getAccessTokenSilently) => {
  const response = await callProtectedAPI(
    getAccessTokenSilently,
    "GET",
    "/analysis"
  );
  return response;
};
const AuthProvider = ({ children }) => {
  const {
    loginWithRedirect,
    logout,
    user,
    isAuthenticated,
    getAccessTokenSilently,
    loginWithPopup,
  } = useAuth0();
  const [analysisSet, setAnalysisSet] = useState([]);
  useEffect(() => {
    fetchAnalysisObject(getAccessTokenSilently)
      .then((response) => {
        console.log("analysis resp : ", response);
        setAnalysisSet(response.analysisSet ? response.analysisSet : []);
      })
      .catch((err) => console.log(err.message));
  }, [user, getAccessTokenSilently]);
  return (
    <AuthContext.Provider
      value={{
        loginWithRedirect,
        logout,
        user,
        isAuthenticated,
        getAccessTokenSilently,
        loginWithPopup,
        analysisSet,
        setAnalysisSet,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
