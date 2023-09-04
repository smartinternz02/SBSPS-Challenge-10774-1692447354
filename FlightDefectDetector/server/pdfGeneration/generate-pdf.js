const PDFDocument = require("pdfkit-table");
const fs = require("fs");
const createTable = require("./create-table");
const tableData = require("../tableData");
async function generatePDF(email, data) {
  console.log("email and data : ", email, data);
  const doc = new PDFDocument();
  const filename = `generated-pdf-${email}-${data.id}.pdf`;
  const generalFontSize = 10;
  // Pipe the PDF document to a file
  const filePath = `./analyzedPDFs/${filename}`;
  const writeStream = fs.createWriteStream(filePath);
  doc.pipe(writeStream);

  // Add content to the PDF
  doc.fontSize(14).text("Flight Defect Analysis Report", { align: "center" });
  doc.moveDown();
  doc
    .fontSize(generalFontSize)
    .text(`Flight Number: ${data.flightInfo.flight_number}`);
  doc.moveDown();
  doc
    .fontSize(generalFontSize)
    .text(`Flight Type: ${data.flightInfo.selected_flight}`);
  doc.moveDown();
  doc
    .fontSize(generalFontSize)
    .text(`Total Flight Hours: ${data.flightInfo.number_input1}`);
  doc.moveDown();
  doc
    .fontSize(generalFontSize)
    .text(`Manufacturing Date: ${data.flightInfo.selected_date}`);
  doc.moveDown();
  doc.fontSize(generalFontSize).text(`Analysis ID: ${data.id}`);
  doc.moveDown();
  const date = new Date(data.date);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();

  doc.fontSize(generalFontSize).text(`Analysis Date: ${day}/${month}/${year}`);
  doc.moveDown(2);
  doc.fontSize(generalFontSize).text(`Summary: `);
  doc.moveDown();
  doc
    .fontSize(generalFontSize)
    .text(`Total Images Uploaded : ${data.summary.total_images_uploaded}`);
  doc.moveDown();
  doc
    .fontSize(generalFontSize)
    .text(`Total defects identified : ${data.summary.total_defects}`);
  doc.moveDown();
  let str = "";
  data.summary.identified_defect_tags.forEach((tag) => {
    str += tag + " ";
  });
  doc.fontSize(generalFontSize).text(`Identfied defect tags : ${str}`);

  // Defect Summary Table
  const defectSummaryTable = {
    headers: ["Defect type", "Total identified"],
    rows: [
      ["Scratch", data.summary["0"].total],
      ["Paint off", data.summary["1"].total],
      ["Cracks", data.summary["2"].total],
      ["Missing Heads", data.summary["3"].total],
      ["Dent", data.summary["4"].total],
    ],
  };

  // Defect Severity Table
  const defectSeverityTable = {
    headers: [
      "Defects/Severity",
      "Scratch",
      "Paint off",
      "Cracks",
      "Missing Heads",
      "Dents",
    ],
    rows: [
      [
        "Code Red",
        data.summary["0"].red,
        data.summary["1"].red,
        data.summary["2"].red,
        data.summary["3"].red,
        data.summary["4"].red,
      ],
      [
        "Code Orange",
        data.summary["0"].orange,
        data.summary["1"].orange,
        data.summary["2"].orange,
        data.summary["3"].orange,
        data.summary["4"].orange,
      ],
      [
        "Code Blue",
        data.summary["0"].blue,
        data.summary["1"].blue,
        data.summary["2"].blue,
        data.summary["3"].blue,
        data.summary["4"].blue,
      ],
    ],
  };

  //Defect size Table
  const defectSizeTable = {
    headers: [
      "Defects/Size",
      "Scratch",
      "Paint off",
      "Cracks",
      "Missing Heads",
      "Dents",
    ],
    rows: [
      [
        "Big",
        data.summary["0"].big,
        data.summary["1"].big,
        data.summary["2"].big,
        data.summary["3"].big,
        data.summary["4"].big,
      ],
      [
        "Medium",
        data.summary["0"].medium,
        data.summary["1"].medium,
        data.summary["2"].medium,
        data.summary["3"].medium,
        data.summary["4"].medium,
      ],
      [
        "Small",
        data.summary["0"].small,
        data.summary["1"].small,
        data.summary["2"].small,
        data.summary["3"].small,
        data.summary["4"].small,
      ],
    ],
  };

  doc.moveDown(2);
  doc
    .font("Helvetica-Bold")
    .fontSize(generalFontSize)
    .text("Defect Summary", { align: "center" });
  doc.moveDown();

  await createTable(doc, defectSummaryTable);
  doc.moveDown();
  doc
    .fontSize(generalFontSize)
    .text(
      `Defect Severity Tabulations * Severity is measured with pre-defined metrics as included in appendix. : `
    );
  doc.moveDown();
  await createTable(doc, defectSeverityTable);
  doc.moveDown();
  doc
    .fontSize(generalFontSize)
    .text(
      `Defect Size Tabulations * Size is measured with pre-defined metrics as included in appendix. : `
    );
  doc.moveDown();
  await createTable(doc, defectSizeTable);
  for (let i = 0; i < 5; i++) {
    doc.addPage();
    doc
      .fontSize(generalFontSize)
      .text(
        "Defect Root Cause Analysis *Root Cause Analysis based on metrics as included in appendix"
      );
    doc.moveDown();
    doc
      .fontSize(generalFontSize)
      .text(`Identified defect : ${tableData[i].name}`);
    doc.moveDown();
    doc
      .fontSize(generalFontSize)
      .text(`Total Identified : ${data.summary[i].total}`);
    doc.moveDown();
    doc.fontSize(generalFontSize).text(`Causes: ${tableData[i].causes}`);
    doc.moveDown();
    doc.fontSize(generalFontSize).text(`Affects: ${tableData[i].affects}`);
    doc.moveDown();
    doc.fontSize(generalFontSize).text(`Solutions: ${tableData[i].solutions}`);
    doc.moveDown();
    doc
      .fontSize(generalFontSize)
      .text(`Preventions: ${tableData[i].preventions}`);
    doc.moveDown();
  }

  for (const [index, image] of data.image_analysis.entries()) {
    doc.addPage();
    // Embed image in the PDF
    doc.fontSize(14).text(`Image Analysis - ${index + 1}`);
    doc.moveDown();
    const imageBuffer = Buffer.from(image.data, "base64");
    doc.image(imageBuffer, {
      fit: [200, 200],
    });
    doc.moveDown();
    // Defect Summary Table
    const defectsTable = {
      headers: ["Annotations", "Defect Type", "Severity", "Size"],
    };
    let rows = [];

    for (const [index, defect] of image.defects.entries()) {
      let curr = [];
      console.log("defect : ", defect);
      curr[0] = index + 1;
      curr[1] = tableData[defect.type].name;
      curr[2] = defect.severity;
      curr[3] = defect.size;
      rows.push(curr);
    }
    defectsTable["rows"] = rows;
    await createTable(doc, defectsTable);
    doc.moveDown();
    const totals = { red: 0, orange: 0, blue: 0, medium: 0, big: 0, small: 0 };
    for (let i = 0; i < 5; i++) {
      totals.red += image[i].red;
      totals.orange += image[i].orange;
      totals.blue += image[i].blue;
      totals.big += image[i].big;
      totals.small += image[i].small;
      totals.medium += image[i].medium;
    }
    // Defect severity Table
    const defectsBySeverity = {
      headers: ["Defect Type", "Red", "Orange", "Blue", "Total Identified"],
    };
    rows = [];
    for (let i = 0; i < 5; i++) {
      let curr = [];
      curr[0] = tableData[i].name;
      curr[1] = image[i].red;
      curr[2] = image[i].orange;
      curr[3] = image[i].blue;
      curr[4] = image[i].total;
      rows.push(curr);
    }
    rows.push([
      "Total",
      totals.red,
      totals.orange,
      totals.blue,
      image.defects.length,
    ]);
    defectsBySeverity["rows"] = rows;
    await createTable(doc, defectsBySeverity);
    doc.moveDown();

    // Defect size Table
    const defectsBySize = {
      headers: ["Defect Type", "Big", "Medium", "Small", "Total Identified"],
    };
    rows = [];
    for (let i = 0; i < 5; i++) {
      let curr = [];
      curr[0] = tableData[i].name;
      curr[1] = image[i].big;
      curr[2] = image[i].medium;
      curr[3] = image[i].small;
      curr[4] = image[i].total;
      rows.push(curr);
    }
    rows.push([
      "Total",
      totals.big,
      totals.medium,
      totals.small,
      image.defects.length,
    ]);
    defectsBySize["rows"] = rows;
    await createTable(doc, defectsBySize);
    doc.moveDown();
  }
  doc.end();
  await new Promise((resolve) => writeStream.on("finish", resolve));
  return { filename, filePath };
}

module.exports = generatePDF;
