const createTable = async (doc, table) => {
  await doc.table(table);
};

module.exports = createTable;
