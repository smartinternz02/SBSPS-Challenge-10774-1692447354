require("dotenv").config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const { verifyJwt, setupUserInfo } = require("./middlewares/auth-middleware");
const MONGO_URL = process.env.MONGO_URL;
const analysisModel = require("./model/analysis");
const axios = require("axios");
const FormData = require("form-data");
const generatePDF = require("./pdfGeneration/generate-pdf");
const sendMail = require("./pdfGeneration/mail-service");

mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log("connection ready");
  })
  .catch((err) => console.log(err.message));

if (!fs.existsSync("./analyzedPhotos")) {
  fs.mkdirSync("./analyzedPhotos");
}
if (!fs.existsSync("./uploads")) {
  fs.mkdirSync("./uploads");
}
if (!fs.existsSync("./analyzedPDFs")) {
  fs.mkdirSync("./analyzedPDFs");
}

const app = express();

app.use("/uploads", express.static(__dirname + "/uploads"));
// app.use("/analyzedPhotos", express.static(__dirname + "/analyzedPhotos"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(cors());

// enforce on all endpoints
app.use(verifyJwt);
app.use(setupUserInfo);

app.get("/api", (req, res) => {
  res.send("/api called : homepage_api");
});

app.get("/api/protected", async (req, res) => {
  res.send(req.user);
});

app.get("/analysis", async (req, res) => {
  const email = req.user.email;
  console.log("email : ", email);
  try {
    let document = await analysisModel.findOne({ userID: email });
    if (!document) {
      const defaultRecord = {
        userID: email,
        user: req.user,
        analysisSet: [],
      };

      document = await analysisModel.create(defaultRecord);
    }
    res.json({ analysisSet: document.analysisSet });
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred", details: error.message });
  }
});

const buildAnalysisObject = (qid, summary, images, flightInfo) => {
  const id = qid;
  const date = new Date();
  const image_analysis = images.map((image) => {
    return {
      defects: image.defects,
      filename: image.filename,
      image_id: image.image_id,
      image_link: image.image_link,
      data: image.data,
      0: image["0"],
      1: image["1"],
      2: image["2"],
      3: image["3"],
      4: image["4"],
    };
  });
  return { id, date, summary, image_analysis, flightInfo };
};
async function sendFilesToFlask(qid, requestData, mail) {
  const form = new FormData();
  const FLASK_URL = process.env.FLASK_URL;
  console.log(FLASK_URL + "/flask");

  requestData.photos.forEach((filePath) => {
    form.append("photos", fs.createReadStream("./uploads/" + filePath));
  });

  form.append("selectedFlight", requestData.flight);
  form.append("selectedDate", requestData.manufacturingDate);
  form.append("numberInput1", requestData.hoursOfFlight);
  form.append("flightNumber", requestData.flightNumber);
  form.append("user_id", mail);

  try {
    let response = await axios.post(FLASK_URL + "/flask", form, {
      headers: { "content-type": "multipart/form-data" },
    });
    console.log("Files sent successfully:", response.data);
    const uploadedPhotos = response.data.uploaded_photos;

    // Save the uploaded photos or perform any other desired action
    uploadedPhotos.forEach((photoData, index) => {
      const photoBuffer = Buffer.from(photoData.data, "base64");
      const savePath = path.join(
        "./analyzedPhotos",
        `${mail}-${qid}-received-photo-${index}.jpg`
      );
      uploadedPhotos[index][
        "image_link"
      ] = `${mail}-${qid}-received-photo-${index}.jpg`;
      fs.writeFileSync(savePath, photoBuffer);
    });
    console.log("image_analysis :", uploadedPhotos);
    const object = buildAnalysisObject(
      qid,
      response.data.summary,
      uploadedPhotos,
      response.data.flight_info
    );
    return object;
  } catch (error) {
    console.error("Error sending files:", error.message);
  }
}
app.post("/analysis", async (req, res) => {
  console.log("request data : ", req.body);
  let document, analysisSet, qid;
  try {
    document = await analysisModel.findOne({ userID: req.user.email });
    analysisSet = document.analysisSet;
    qid = analysisSet.length;
    const objectResponse = await sendFilesToFlask(
      qid,
      req.body,
      req.user.email
    );

    analysisSet.push(objectResponse);

    await analysisModel.updateOne(
      { userID: req.user.email },
      { $set: { analysisSet: analysisSet } }
    );

    res.json({ analysis: objectResponse });
  } catch (error) {
    console.log(error.message);
    res.json({ error: error.message });
  }
});

const processResults = async (req, analysisSet, analysis) => {
  analysisSet.push(analysis);
  await analysisModel.updateOne(
    { userID: req.user.email },
    { $set: { analysisSet: analysisSet } }
  );
  console.log("generate pdf called");
  const { filename, filePath } = await generatePDF(req.user.email, analysis);
  console.log("pdf generated");
  console.log("pdf data items : ", filename, filePath);
  sendMail(req.user.email, filename, filePath);
  return analysis;
};
app.post("/bulkAnalysis", async (req, res) => {
  console.log("request data : ", req.body);
  let document, analysisSet, qid;
  try {
    document = await analysisModel.findOne({ userID: req.user.email });
    analysisSet = document.analysisSet;
    qid = analysisSet.length;
    sendFilesToFlask(qid, req.body, req.user.email)
      .then((objectResponse) => {
        processResults(req, analysisSet, objectResponse)
          .then((analysis) => {
            res.json({ analysis });
          })
          .catch((err) => {
            console.log("error in processingResults() : ", err.message);
          });
      })
      .catch((err) => {
        console.log("error in flask : ", err.message);
      });
  } catch (error) {
    console.log(error.message);
    res.json({ error: error.message });
  }
});

const photosMiddleware = multer({ dest: "uploads" });
app.post("/upload", photosMiddleware.array("photos", 100), (req, res) => {
  const uploadedFiles = [];
  console.log("files recived : ", req.files);
  for (let i = 0; i < req.files.length; i++) {
    console.log(req.files[i]);
    const { path, originalname } = req.files[i];
    const parts = originalname.split(".");
    const extension = parts[parts.length - 1];
    const newPath = path + "." + extension;
    fs.renameSync(path, newPath);
    const dispPath = newPath.replace("uploads\\", "");
    uploadedFiles.push(dispPath);
  }
  res.json(uploadedFiles);
});

app.listen(8000, () => {
  console.log("Server on port 8000");
});
