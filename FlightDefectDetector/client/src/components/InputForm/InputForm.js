import React, { useState } from "react";
import UploadedPhotos from "../UploadedPhotos/UploadedPhotos";
import { callProtectedAPI } from "../../utils/callProtectedAPI";
import AuthContext from "../../store/auth-context";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import classes from "./InputForm.module.css";
import axios from "axios";
import ReactLoading from "react-loading";
import {
  CDBInput,
  CDBCard,
  CDBCardBody,
  CDBBtn,
  CDBLink,
  CDBContainer,
  CDBSelect,
} from "cdbreact";

const InputForm = () => {
  const navigate = useNavigate();

  const { getAccessTokenSilently, setAnalysisSet, user } =
    useContext(AuthContext);

  const [selectedFlight, setSelectedFlight] = useState("");
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [numberInput1, setNumberInput1] = useState(0);
  const [selectedNumber, setSelectedNumber] = useState("");

  const [analyzing, setAnalyzing] = useState(false);

  const handleFlightChange = (event) => {
    console.log(event.target.value);
    setSelectedFlight(event.target.value);
  };

  const handleDateChange = (event) => {
    console.log(event.target.value);
    setSelectedDate(event.target.value);
  };

  const handleNumberInput1Change = (event) => {
    console.log(event.target.value);
    setNumberInput1(event.target.value);
  };

  const handleNumberChange = (e) => {
    console.log(e.target.value);
    setSelectedNumber(e.target.value);
  };

  const afterPostUpload = (response) => {
    const { data: filenames } = response;
    console.log(filenames);
    setSelectedPhotos((prev) => [...prev, ...filenames]);
  };

  function removePhoto(e, filename) {
    e.preventDefault();
    setSelectedPhotos([
      ...selectedPhotos.filter((photo) => photo !== filename),
    ]);
  }

  async function uploadPhoto(e) {
    console.log("uploadPhoto called");
    const files = e.target.files;
    const data = new FormData();
    for (let i = 0; i < files.length; i++) {
      data.append("photos", files[i]);
    }
    console.log(data);
    await callProtectedAPI(
      getAccessTokenSilently,
      "POST",
      "/upload",
      data,
      {
        "Content-Type": "multipart/form-data",
      },
      afterPostUpload
    );
  }

  const validateForm = () => {
    // Implement your validation logic here
    if (!selectedFlight) {
      alert("Please select a flight.");
      return false;
    }
    if (!selectedNumber) {
      alert("Please enter a flight number.");
      return false;
    }

    if (selectedPhotos.length === 0) {
      alert("Please upload at least one photo.");
      return false;
    }

    if (!selectedDate) {
      alert("Please select a manufacturing date.");
      return false;
    }

    if (numberInput1 <= 0) {
      alert("Hours of flight and miles travelled must be greater than 0.");
      return false;
    }

    return true;
  };

  const afterPostAnalyze = (response) => {
    console.log("response for input form: ", response.data);
    setAnalysisSet((prev) => [...prev, response.data.analysis]);
    navigate(`/history/${response.data.analysis.id}`);
  };

  const afterBulkPostAnalyze = (response) => {
    console.log("response for input form: ", response.data);
    setAnalysisSet((prev) => [...prev, response.data.analysis]);
  };

  const analyze = async () => {
    if (validateForm()) {
      if (selectedPhotos.length < 3) {
        const requestData = {
          flight: selectedFlight,
          photos: selectedPhotos,
          manufacturingDate: selectedDate,
          hoursOfFlight: numberInput1,
          flightNumber: selectedNumber,
        };
        await callProtectedAPI(
          getAccessTokenSilently,
          "POST",
          "/analysis",
          requestData,
          {},
          afterPostAnalyze
        );
        return null;
      } else {
        //send mail and alert user
        const requestData = {
          flight: selectedFlight,
          photos: selectedPhotos,
          manufacturingDate: selectedDate,
          hoursOfFlight: numberInput1,
          flightNumber: selectedNumber,
        };
        const token = await getAccessTokenSilently({
          authorizationParams: {
            audience: `MyExpressAPI`,
            scope: "openid profile email",
          },
        });
        axios
          .post("/bulkAnalysis", requestData, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((response) => {
            console.log("resp : ", response);
            afterBulkPostAnalyze(response);
          });
        alert(
          "Please check your mail for the detailed report in some time...It might take some time for the report to become avaiable in your history"
        );
        setAnalyzing(false);
        navigate("/homepage");
      }
    }
  };

  const handleAnalyze = () => {
    setAnalyzing(true);
    analyze()
      .then(() => {
        console.log("analysis complete");
      })
      .catch((err) => {
        console.log(err.message);
      });
  };
  const option = [
    {
      text: "Flight A",
      value: "Flight A",
    },
    {
      text: "Flight B",
      value: "Flight B",
    },
    {
      text: "Flight C",
      value: "Flight C",
    },
  ];

  return (
    <div>
      {!analyzing && (
        <CDBContainer style={{ display: "inline-block", width: "40rem" }}>
          <CDBCard style={{ margin: "center", padding: "0%", margin: "0%" }}>
            <div
              className="text-center text-white"
              style={{ background: "black", padding: "0%", margin: "0%" }}
            >
              <p className="h5 mt-2 py-4 font-weight-bold">Enter details</p>
            </div>
            <CDBCardBody className="mx-4">
              {/* <p className="text-center mt-2">
          Join our mailing list. We write rarely, but only the best content.
        </p>
        <CDBLink className="text-center p-0" to="#">
          See the last newsletter
  </CDBLink>*/}
              <CDBInput
                label="Flight Number:"
                type="text"
                value={selectedNumber}
                onChange={handleNumberChange}
              />
              <p className="text-left m-0">Flight Type:</p>
              <CDBSelect
                options={option}
                value={selectedFlight}
                onChange={handleFlightChange}
                style={{
                  height: "2.5rem",
                  width: "30rem",
                  margin: "center",
                  width: "100%",
                  color: "none",
                }}
              />
              <CDBInput
                label="Upload photos: "
                type="file"
                id="file-input"
                name="file-input"
                className={classes.fileInput}
                multiple
                onChange={uploadPhoto}
                accept="image/*"
                style={{
                  height: "2.5rem",
                  width: "30rem",
                  margin: "center",
                  width: "100%",
                  color: "#AFAFAF",
                }}
              />
              <UploadedPhotos
                photos={selectedPhotos}
                removePhoto={removePhoto}
              />
              <CDBInput
                label="Manufacturing Date: "
                type="date"
                value={selectedDate}
                onChange={handleDateChange}
              />
              <CDBInput
                label="Hours of Flight: "
                type="number"
                value={numberInput1}
                onChange={handleNumberInput1Change}
              />
              <CDBBtn
                onClick={handleAnalyze}
                color="dark"
                outline
                className="btn-block my-3 mx-0"
              >
                Analyze
              </CDBBtn>
            </CDBCardBody>
          </CDBCard>
        </CDBContainer>
      )}
      {analyzing && (
        <div className={classes.loadingContainer}>
          <ReactLoading type="spin" color="#000" />
          <div>Loading...</div>
        </div>
      )}
    </div>
  );
};

export default InputForm;
