import axios from "axios";
import MainNavigation from "../MainNav/MainNavigation";
import InputForm from "../InputForm/InputForm";
import AuthContext from "../../store/auth-context";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { callProtectedAPI } from "../../utils/callProtectedAPI";
import classes from "./HomePage.module.css";
import {
  CDBInput,
  CDBCard,
  CDBCardBody,
  CDBBtn,
  CDBLink,
  CDBContainer,
} from "cdbreact";

const HomePage = () => {
  const { user, isAuthenticated, getAccessTokenSilently, analysisSet } =
    useContext(AuthContext);
  console.log(user, isAuthenticated, analysisSet);

  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated]);

  function callAPI() {
    axios
      .get("/api")
      .then((response) => console.log(response.data))
      .catch((err) => console.log(err.message));
  }
  async function callSecAPI() {
    const data = await callProtectedAPI(
      getAccessTokenSilently,
      "GET",
      "/api/protected"
    );
    console.log(data);
  }

  return (
    <>
      <MainNavigation />
      {/* <div>Home Page</div>
      <ul>
        <li>
          <button onClick={callAPI}>Call API</button>
        </li>
        <li>
          <button onClick={callSecAPI}>Call protected API</button>
        </li>
      </ul> */}

      <div
        className="text-center text-white"
        style={{
          width: "30rem",
          margin: "center",
          width: "100%",
          padding: "2% 10% 2% 10%",
        }}
      >
        <div className={classes.header}>Hi there, {user?.name}!</div>
      </div>

      <div className={classes.container}>
        <InputForm />
      </div>
    </>
  );
};

export default HomePage;
