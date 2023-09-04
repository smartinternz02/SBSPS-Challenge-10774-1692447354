import classes from "./UploadedPhotos.module.css";
const UploadedPhotos = ({ photos, removePhoto }) => {
  return (
    <div className={classes.photosContainer}>
      {photos.length > 0 &&
        photos.map((link) => (
          <div
            key={link}
            style={{ position: "relative", display: "inline-block" }}
          >
            <img
              src={"/uploads/" + link}
              style={{ width: "140px", height: "140px" }}
            />
            <button
              style={{
                position: "absolute",
                top: "0",
                right: "0",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                color: "#fff",
                border: "none",
                padding: "5px 10px",
                cursor: "pointer",
                borderBottomLeftRadius: "20%",
              }}
              onClick={(e) => removePhoto(e, link)}
            >
              X
            </button>
          </div>
        ))}
    </div>
  );
};

export default UploadedPhotos;
