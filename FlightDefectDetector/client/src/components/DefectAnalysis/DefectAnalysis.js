import tableData from "../../store/tableData.js";
import { useState, useEffect, useRef } from "react";
import classes from "./DefectAnalysis.module.css";

const useRefDimensions = (ref) => {
  const [dimensions, setDimensions] = useState({ width: 1, height: 2 });
  useEffect(() => {
    if (ref.current) {
      const { current } = ref;
      const boundingRect = current.getBoundingClientRect();
      const { width, height } = boundingRect;
      setDimensions({ width: Math.round(width), height: Math.round(height) });
    }
  }, [ref]);
  return dimensions;
};

const DefectAnalysis = ({ img, setClicked, setImg }) => {
  console.log("img : ", img);
  const [originalWidth, setOriginalWidth] = useState(null);
  const [originalHeight, setOriginalHeight] = useState(null);
  const imageContainerRef = useRef(null);
  const dimensions = useRefDimensions(imageContainerRef);
  const handleImageLoad = (event) => {
    const image = event.target;

    // Get the original width and height
    setOriginalWidth(image.naturalWidth);
    setOriginalHeight(image.naturalHeight);
  };

  //img.defects;
  const defects = img.defects;
  console.log("defects : ", defects);

  console.log("defects : ", defects);
  console.log(classes);

  const [hoveredDefect, setHoveredDefect] = useState(null);
  const [imageWidth, setImageWidth] = useState(0);
  const [imageHeight, setImageHeight] = useState(0);
  // console.log(imageContainerRef.current.clientHeight);
  // console.log(imageContainerRef.current.clientWidth);
  const handleRectangleHover = (event, defect) => {
    setHoveredDefect(defect);
  };

  useEffect(() => {
    const handleResize = () => {
      setImageWidth(window.innerWidth); // Update the image's current displayed width on window resize
      setImageHeight(window.innerHeight); // Update the image's current displayed height on window resize
      console.log(imageWidth);
      console.log(imageHeight);
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Set initial image width

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [dimensions]);

  // const handleMouseLeave = (event, defect) => {
  //   setHoveredDefect(null);
  // };
  return (
    <div>
      {/* <button
        onClick={() => {
          setClicked(false);
          setImg({});
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-6 h-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18"
          />
        </svg>
      </button> */}

      <div style={{ display: "flex", justifyContent: "space-around" }}>
        <div
          className={classes.imageContainer}
          style={{
            width: "auto",
            // display: "flex",
            // justifyContent: "center",
            // alignItems: "center",
            position: "relative",
          }}
          ref={imageContainerRef}
        >
          <img
            src={`data:image/${
              img.filename.split(".")[img.filename.split(".").length - 1]
            };base64,${img.data}`}
            style={{ maxHeight: "100%", maxWidth: "100%" }}
            onLoad={handleImageLoad}
          />
          <div
            onClick={() => {
              setClicked(false);
              setImg({});
            }}
            style={{
              position: "absolute",
              top: "0",
              left: "0",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              color: "#fff",
              border: "none",
              padding: "5px 10px",
              cursor: "pointer",
              borderBottomRightRadius: "20%",
            }}
            className={classes.arrowContainer}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          {defects.map((defect, index) => (
            <div
              key={index}
              className="rectangle"
              style={{
                position: "absolute",
                left:
                  (defect.coords[0] - defect.coords[2] / 2) * dimensions.width -
                  2,
                top:
                  (defect.coords[1] - defect.coords[3] / 2) *
                    dimensions.height -
                  2,
                width: defect.coords[2] * dimensions.width,
                height: defect.coords[3] * dimensions.height,
              }}
              onMouseEnter={(e) => handleRectangleHover(e, defect)}
              // onMouseLeave={(e) => handleMouseLeave(e, defect)}
            ></div>
          ))}
        </div>
        <div className={classes.infoContainer} style={{ width: "auto" }}>
          <h4>
            Hover over the rectangle(s) to know more about the defects
            identified. Dimensions : {dimensions.width} {dimensions.height}
            {/* {originalWidth && originalHeight && (
              <p>
                Original Dimensions: {originalWidth} x {originalHeight}
              </p>
            )} */}
          </h4>
          {hoveredDefect && (
            <div className={classes.defectInfoContainer}>
              <h3>Type : {tableData[hoveredDefect.type].name}</h3>
              <p>Severity : {hoveredDefect.severity}</p>
              <p>Size : {hoveredDefect.size}</p>
              {/* <p>Causes : {tableData[hoveredDefect.type].causes}</p>
              <p>Affects : {tableData[hoveredDefect.type].affects}</p>
              <p>Solutions : {tableData[hoveredDefect.type].solutions}</p>
              <p>Preventions : {tableData[hoveredDefect.type].preventions}</p> */}
            </div>
          )}
          {/* <h1>Defect Name</h1>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Assumenda
            vitae aperiam nam enim voluptatum facilis, alias sit cupiditate
            pariatur veniam minus quis eveniet inventore eligendi corrupti dicta
            necessitatibus consectetur optio accusantium nihil similique sint
            nesciunt? Possimus ratione quam modi nobis enim accusamus nemo
            eligendi explicabo mollitia culpa, deleniti magnam laboriosam at
            veritatis quisquam illum consequatur incidunt aliquid cupiditate,
            maiores eos maxime! Voluptas officiis deserunt nam facere debitis
            tempore, sed est iste enim incidunt itaque, illum atque magnam
            cumque. Exercitationem voluptates minus ducimus tempore. Distinctio
            nulla quidem doloribus quod doloremque laboriosam, impedit, tempora
            rerum quos, a repellendus iure sequi sapiente veritatis?
            {originalWidth && originalHeight && (
              <p>
                Original Dimensions: {originalWidth} x {originalHeight}
              </p>
            )}
            {resizedWidth && resizedHeight && (
              <p>
                Resized Dimensions: {resizedWidth} x {resizedHeight}
              </p>
            )}
            {hoveredInfo && (
              <div className="hovered-info">
                <p>{hoveredInfo}</p>
                <p>Cause: {hoveredCause}</p>
              </div>
            )}
          </p> */}
        </div>
      </div>
    </div>
  );
};

export default DefectAnalysis;
