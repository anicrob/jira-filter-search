const { refineDetails, searchFilters, returnCSV } = require("./helpers.js");
require("dotenv").config();

const script = async () => {
  const filtersMatch = await searchFilters();
  if (filtersMatch.length > 0) {
    const refinedData = await refineDetails(filtersMatch);
    await returnCSV(refinedData);
  } else {
    console.log(
      `there are no filters that contain the word, "${process.env.SEARCH_KEYWORD}" in this instance`
    );
    return;
  }
};

script();
