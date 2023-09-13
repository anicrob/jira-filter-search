const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const fs = require("fs");
require("dotenv").config();

const filterDataMatch = [];
const searchFilters = async () => {
  const index = [
    0, 50, 100, 150, 200, 250, 300, 350, 400, 450, 500, 550, 600, 650, 700, 750,
    800, 850, 900, 950, 1000, 1050, 1100, 1150, 1200, 1250, 1300, 1350, 1400,
    1450, 1500, 1550, 1600, 1650, 1700, 1750, 1800, 1850, 1900, 1950, 2000,
    2050, 2100, 2150, 2200,
  ];
  await Promise.all(
    index.map(async (i) => {
      try {
        const response = await fetch(
          `${process.env.URL}/rest/api/3/filter/search/?maxResults=50&startAt=${i}&expand=description,owner,jql,searchUrl,viewUrl`,
          {
            method: "GET",
            headers: {
              Authorization: `Basic ${process.env.API_KEY}`,
              Accept: "application/json",
            },
          }
        );
        let { values } = await response.json();
        if (values.length > 0) {
          values.map((filter) => {
            if (!!filter.jql.includes(`${process.env.SEARCH_KEYWORD}`)) {
              filterDataMatch.push(filter);
            }
          });
        } else if (values.length === 1) {
          console.log(values.jql);
          if (!!values.jql.includes(`${process.env.SEARCH_KEYWORD}`)) {
            filterDataMatch.push(...values);
          }
          return;
        } else {
          return;
        }
      } catch (err) {
        console.log(err);
      }
    })
  );
  return filterDataMatch;
};

const refineDetails = async (allFilterDetails) => {
  const refinedFilterDetails = allFilterDetails.map(
    ({ id, name, description, owner, jql, viewUrl, searchUrl }) => ({
      id,
      name,
      description: description ? description : " ",
      owner: owner.displayName,
      jql,
      viewUrl,
      searchUrl,
    })
  );
  return refinedFilterDetails;
};

const returnCSV = async (data) => {
  const csvRows = [];
  //get the headers (properties) from the first object in the data array
  const headers = Object.keys(data[0]);
  //add the headers to the csvRows array, joined by a comma
  csvRows.push(headers.join(","));
  // Loop to get value of each object's key
  for (const row of data) {
    const values = headers.map((header) => {
      const val = row[header];
      return `"${val}"`;
    });

    // To add, separator between each value
    csvRows.push(values.join(","));
  }

  //To add new line for each object's value
  const finalData = csvRows.join("\n");

  // use fs.writeFile to create the .csv file
  fs.writeFile(
    `filters containing "${process.env.SEARCH_KEYWORD}".csv`,
    finalData,
    { encoding: "utf8" },
    (err) => {
      if (err) {
        console.log(err);
        return;
      }
    }
  );

  console.log(
    `filters containing "${process.env.SEARCH_KEYWORD}".csv has been successfully created!`
  );
};

module.exports = {
  refineDetails,
  searchFilters,
  returnCSV,
};
