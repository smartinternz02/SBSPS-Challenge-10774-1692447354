import tableData from "../../store/tableData";
import classes from "./Summary.module.css";
const Summary = ({ data }) => {
  return (
    <div className={classes.summaryContainer}>
      <p>
        <strong>Total Images uploaded : </strong>
        {data.total_images_uploaded}
      </p>
      <p>
        <strong>Total Defects Identified : </strong>
        {data.total_defects}
      </p>
      <p>
        <strong>Identified defect tags : </strong>

        {data.identified_defect_tags.map((tag) => tag + " ")}
      </p>
    </div>
  );
};

export default Summary;
