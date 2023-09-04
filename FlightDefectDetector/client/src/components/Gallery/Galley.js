import classes from "./Galley.module.css";

const Gallery = ({ setImg, setClicked, analysis }) => {
  const handleClick = (image, idx) => {
    console.log(image, " clicked");
    setClicked(true);
    setImg({ ...image });
  };

  return (
    <div className={classes.galleyImageContainer}>
      {analysis.image_analysis.length > 0 &&
        analysis.image_analysis.map((image, idx) => (
          <img
            src={`data:image/${
              image.filename.split(".")[image.filename.split(".").length - 1]
            };base64,${image.data}`}
            style={{ width: "200px", height: "200px", cursor: "pointer" }}
            key={idx}
            onClick={() => handleClick(image, idx)}
          />
        ))}
    </div>
  );
};

export default Gallery;
