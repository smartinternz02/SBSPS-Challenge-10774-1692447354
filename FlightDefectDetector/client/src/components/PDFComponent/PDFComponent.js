import tableData from "../../store/tableData";
import {
  Page,
  Document,
  Text,
  Image,
  StyleSheet,
  View,
} from "@react-pdf/renderer";
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    padding: 20,
    fontSize: 12,
  },
  pageChildStyle: {
    marginTop: 18,
    marginBottom: 18,
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  section: {
    marginBottom: 10,
  },
  summarySection: {
    marginTop: 20,
  },
  table: {
    display: "table",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    margin: "auto",
    flexDirection: "row",
    width: "100%",
  },
  tableCol: {
    width: "50%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCol2: {
    width: "17%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCol3: {
    width: "25%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCol4: {
    width: "20%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCell: {
    margin: "auto",
    marginTop: 5,
    fontSize: 10,
  },
  italicText: {
    fontStyle: "italic",
  },
  boldText: {
    fontWeight: "bold",
  },
  setWidth50: {
    width: "50%",
  },
});
const PDFComponent = ({ id, date, flightInfo, image_analysis, summary }) => {
  const rows = [];
  for (let i = 0; i < 5; i++) {
    rows.push(summary[i]);
  }
  const rows2 = image_analysis.map((imageAnalysis) => {
    let red = 0,
      orange = 0,
      blue = 0,
      big = 0,
      medium = 0,
      small = 0;
    for (let i = 0; i < 5; i++) {
      red += imageAnalysis[i].red;
      orange += imageAnalysis[i].orange;
      blue += imageAnalysis[i].blue;
      big += imageAnalysis[i].big;
      medium += imageAnalysis[i].medium;
      small += imageAnalysis[i].small;
    }
    return {
      totalRed: red,
      totalOrange: orange,
      totalBlue: blue,
      totalMedium: medium,
      totalSmall: small,
      totalBig: big,
    };
  });

  return (
    <Document>
      {/* Page 1: Flight Info */}
      <Page size="A4" style={styles.page}>
        <View style={[styles.titleContainer, styles.pageChildStyle]}>
          <Text style={styles.title}>AIRCRAFT DEFECT COMPLETE REPORT</Text>
        </View>
        <View style={[styles.section, styles.pageChildStyle]}>
          <Text>Analysis ID: #{id}</Text>
          <Text>Analysis Date: {date}</Text>
          <Text>Flight Number: {flightInfo.flight_number}</Text>
          <Text>Flight Type: {flightInfo.selected_flight}</Text>
          <Text>Total Flight Hours: {flightInfo.number_input1}</Text>
          <Text>Manufacturing date: {flightInfo.selected_date}</Text>
        </View>
        <View style={[styles.summarySection, styles.pageChildStyle]}>
          <Text>Summary : </Text>
          <Text>Total Images uploaded : {summary.total_images_uploaded} </Text>
          <Text>Total defects identified : {summary.total_defects}</Text>
          <Text>
            Identified defect tags :{" "}
            {summary.identified_defect_tags.map((tag) => tag + " ")}{" "}
          </Text>
        </View>

        {/* {Defects identified table} */}
        <Text style={styles.boldText}>Defects identified summarizations </Text>
        <View style={[styles.table, styles.pageChildStyle]}>
          <View style={styles.tableRow}>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Defect Type</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Total Identified</Text>
            </View>
          </View>
          {rows.map((row) => (
            <View style={styles.tableRow}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{row.name}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{row.total}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* {Defect Severity Tabulations } */}
        <Text style={styles.boldText}>Defect Severity Tabulations </Text>
        <Text style={styles.italicText}>
          Severity is measured with pre-defined metrics as included in appendix.
        </Text>
        <View style={[styles.table, styles.pageChildStyle]}>
          <View style={styles.tableRow}>
            <View style={styles.tableCol2}>
              <Text style={styles.tableCell}>Defects/Severity</Text>
            </View>
            {rows.map((row) => (
              <View style={styles.tableCol2}>
                <Text style={styles.tableCell}>{row.name}</Text>
              </View>
            ))}
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableCol2}>
              <Text style={styles.tableCell}>Code Red</Text>
            </View>
            {rows.map((row) => (
              <View style={styles.tableCol2}>
                <Text style={styles.tableCell}>{row.red}</Text>
              </View>
            ))}
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableCol2}>
              <Text style={styles.tableCell}>Code Orange</Text>
            </View>
            {rows.map((row) => (
              <View style={styles.tableCol2}>
                <Text style={styles.tableCell}>{row.orange}</Text>
              </View>
            ))}
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableCol2}>
              <Text style={styles.tableCell}>Code Blue</Text>
            </View>
            {rows.map((row) => (
              <View style={styles.tableCol2}>
                <Text style={styles.tableCell}>{row.blue}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* {Defect Size Tabulations } */}
        <Text style={styles.boldText}>Defect Size Tabulations </Text>
        <Text style={styles.italicText}>
          Size is measured with pre-defined metrics as included in appendix.
        </Text>
        <View style={[styles.table, styles.pageChildStyle]}>
          <View style={styles.tableRow}>
            <View style={styles.tableCol2}>
              <Text style={styles.tableCell}>Defects/Severity</Text>
            </View>
            {rows.map((row) => (
              <View style={styles.tableCol2}>
                <Text style={styles.tableCell}>{row.name}</Text>
              </View>
            ))}
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableCol2}>
              <Text style={styles.tableCell}>Big</Text>
            </View>
            {rows.map((row) => (
              <View style={styles.tableCol2}>
                <Text style={styles.tableCell}>{row.big}</Text>
              </View>
            ))}
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableCol2}>
              <Text style={styles.tableCell}>Medium</Text>
            </View>
            {rows.map((row) => (
              <View style={styles.tableCol2}>
                <Text style={styles.tableCell}>{row.medium}</Text>
              </View>
            ))}
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableCol2}>
              <Text style={styles.tableCell}>Small</Text>
            </View>
            {rows.map((row) => (
              <View style={styles.tableCol2}>
                <Text style={styles.tableCell}>{row.small}</Text>
              </View>
            ))}
          </View>
        </View>
      </Page>

      {/* Page 2: Root Cause Analysis */}
      {rows.map((row, idx) => (
        <Page size="A4" style={styles.page}>
          <View style={styles.section}>
            {/* ... Render root cause analysis here */}
            <Text style={styles.pageChildStyle}>
              Defect Root Cause Analysis{" "}
            </Text>
            <Text style={styles.pageChildStyle}>
              *Root Cause Analysis based on metrics as included in appendix
            </Text>
            <Text style={styles.pageChildStyle}>
              Identified defect : {row.name}
            </Text>
            <Text style={styles.pageChildStyle}>
              Total identified : {row.total}
            </Text>
            <Text style={styles.pageChildStyle}>
              Causes : {tableData[idx].causes}
            </Text>
            <Text style={styles.pageChildStyle}>
              Affects : {tableData[idx].affects}
            </Text>
            <Text style={styles.pageChildStyle}>
              Solutions : {tableData[idx].solutions}
            </Text>
            <Text style={styles.pageChildStyle}>
              Preventions : {tableData[idx].preventions}
            </Text>
          </View>
        </Page>
      ))}

      {/* Page 3 and onward: Image Analyses */}
      {image_analysis.map((imageAnalysis, pageIndex) => (
        <Page size="A4" style={styles.page}>
          <Text style={styles.pageChildStyle}>
            Image Analysis - Image {pageIndex + 1}
          </Text>
          <Image
            style={[styles.pageChildStyle, styles.setWidth50]}
            src={`data:image/jpeg;base64,${imageAnalysis.data}`}
          />
          {/* {Defects table} */}
          <Text style={styles.boldText}>Defects </Text>
          <View style={[styles.table, styles.pageChildStyle]}>
            <View style={styles.tableRow}>
              <View style={styles.tableCol3}>
                <Text style={styles.tableCell}>Annotations</Text>
              </View>
              <View style={styles.tableCol3}>
                <Text style={styles.tableCell}>Defect Type</Text>
              </View>
              <View style={styles.tableCol3}>
                <Text style={styles.tableCell}>Severity</Text>
              </View>
              <View style={styles.tableCol3}>
                <Text style={styles.tableCell}>Size</Text>
              </View>
            </View>
            {imageAnalysis.defects.map((defect, idx) => (
              <View style={styles.tableRow}>
                <View style={styles.tableCol3}>
                  <Text style={styles.tableCell}>{idx + 1}</Text>
                </View>
                <View style={styles.tableCol3}>
                  <Text style={styles.tableCell}>
                    {tableData[defect.type].name}
                  </Text>
                </View>
                <View style={styles.tableCol3}>
                  <Text style={styles.tableCell}>{defect.severity}</Text>
                </View>
                <View style={styles.tableCol3}>
                  <Text style={styles.tableCell}>{defect.size}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* {Defect tabulations 1 } */}
          <Text sty>Defects by severity : </Text>
          <View style={[styles.table, styles.pageChildStyle]}>
            <View style={styles.tableRow}>
              <View style={styles.tableCol4}>
                <Text style={styles.tableCell}>Defect Type</Text>
              </View>
              <View style={styles.tableCol4}>
                <Text style={styles.tableCell}>Red</Text>
              </View>
              <View style={styles.tableCol4}>
                <Text style={styles.tableCell}>Orange</Text>
              </View>
              <View style={styles.tableCol4}>
                <Text style={styles.tableCell}>Blue</Text>
              </View>
              <View style={styles.tableCol4}>
                <Text style={styles.tableCell}>Total Identified</Text>
              </View>
            </View>
            {rows.map((row, idx) => (
              <View style={styles.tableRow}>
                <View style={styles.tableCol4}>
                  <Text style={styles.tableCell}>{tableData[idx].name}</Text>
                </View>
                <View style={styles.tableCol4}>
                  <Text style={styles.tableCell}>{imageAnalysis[idx].red}</Text>
                </View>
                <View style={styles.tableCol4}>
                  <Text style={styles.tableCell}>
                    {imageAnalysis[idx].orange}
                  </Text>
                </View>
                <View style={styles.tableCol4}>
                  <Text style={styles.tableCell}>
                    {imageAnalysis[idx].blue}
                  </Text>
                </View>
                <View style={styles.tableCol4}>
                  <Text style={styles.tableCell}>
                    {imageAnalysis[idx].total}
                  </Text>
                </View>
              </View>
            ))}

            <View style={styles.tableRow}>
              <View style={styles.tableCol4}>
                <Text style={styles.tableCell}>Total</Text>
              </View>
              <View style={styles.tableCol4}>
                <Text style={styles.tableCell}>
                  {rows2[pageIndex].totalRed}
                </Text>
              </View>
              <View style={styles.tableCol4}>
                <Text style={styles.tableCell}>
                  {rows2[pageIndex].totalOrange}
                </Text>
              </View>
              <View style={styles.tableCol4}>
                <Text style={styles.tableCell}>
                  {rows2[pageIndex].totalBlue}
                </Text>
              </View>
              <View style={styles.tableCol4}>
                <Text style={styles.tableCell}>
                  {imageAnalysis.defects.length}
                </Text>
              </View>
            </View>
          </View>

          {/* {Defect tabulations 2 } */}
          <Text sty>Defects by size : </Text>
          <View style={[styles.table, styles.pageChildStyle]}>
            <View style={styles.tableRow}>
              <View style={styles.tableCol4}>
                <Text style={styles.tableCell}>Defect Type</Text>
              </View>
              <View style={styles.tableCol4}>
                <Text style={styles.tableCell}>Big</Text>
              </View>
              <View style={styles.tableCol4}>
                <Text style={styles.tableCell}>Medium</Text>
              </View>
              <View style={styles.tableCol4}>
                <Text style={styles.tableCell}>Small</Text>
              </View>
              <View style={styles.tableCol4}>
                <Text style={styles.tableCell}>Total Identified</Text>
              </View>
            </View>
            {rows.map((row, idx) => (
              <View style={styles.tableRow}>
                <View style={styles.tableCol4}>
                  <Text style={styles.tableCell}>{tableData[idx].name}</Text>
                </View>
                <View style={styles.tableCol4}>
                  <Text style={styles.tableCell}>{imageAnalysis[idx].big}</Text>
                </View>
                <View style={styles.tableCol4}>
                  <Text style={styles.tableCell}>
                    {imageAnalysis[idx].medium}
                  </Text>
                </View>
                <View style={styles.tableCol4}>
                  <Text style={styles.tableCell}>
                    {imageAnalysis[idx].small}
                  </Text>
                </View>
                <View style={styles.tableCol4}>
                  <Text style={styles.tableCell}>
                    {imageAnalysis[idx].total}
                  </Text>
                </View>
              </View>
            ))}

            <View style={styles.tableRow}>
              <View style={styles.tableCol4}>
                <Text style={styles.tableCell}>Total</Text>
              </View>
              <View style={styles.tableCol4}>
                <Text style={styles.tableCell}>
                  {rows2[pageIndex].totalBig}
                </Text>
              </View>
              <View style={styles.tableCol4}>
                <Text style={styles.tableCell}>
                  {rows2[pageIndex].totalMedium}
                </Text>
              </View>
              <View style={styles.tableCol4}>
                <Text style={styles.tableCell}>
                  {rows2[pageIndex].totalSmall}
                </Text>
              </View>
              <View style={styles.tableCol4}>
                <Text style={styles.tableCell}>
                  {imageAnalysis.defects.length}
                </Text>
              </View>
            </View>
          </View>
        </Page>
      ))}
    </Document>
  );
};

export default PDFComponent;
