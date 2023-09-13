const {
  getInactiveUsers,
  findInactiveUserDashboards,
  findInactiveUserFilters,
  returnCSV,
} = require("./helpers.js");
require("dotenv").config();

const script = async () => {
  const filtersMatch = await searchFilters();
  if(filtersMatch){
    const refinedData = await refineDetails(filtersMatch);
    const generateCSV = await returnCSV(refinedData, `${process.env.SEARCH_KEYWORD}`)
  }
};

script();
