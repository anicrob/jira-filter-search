const {
  refineDetails,
  searchFilters,
  returnCSV,
} = require("./helpers.js");
require("dotenv").config();

const script = async () => {
  const filtersMatch = await searchFilters();
  if(filtersMatch){
    const refinedData = await refineDetails(filtersMatch);
    await returnCSV(refinedData)
  } 
};

script();
