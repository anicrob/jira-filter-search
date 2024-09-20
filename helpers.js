const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const fs = require("fs");
require("dotenv").config();

const filterDataMatch = [];
const searchFilters = async () => {
  let i = 0;
  let isLast = false;
  do {
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
      let data = await response.json();
      if (data.values.length > 0) {
        data.values.map((filter) => {
          if (
            !!filter.jql
              .toLowerCase()
              .includes(`${process.env.SEARCH_KEYWORD}`.toLowerCase())
          ) {
            filterDataMatch.push(filter);
          }
        });
      } else if (data.values.length === 1) {
        if (
          !!data.values.jql
            .toLowerCase()
            .includes(`${process.env.SEARCH_KEYWORD}`.toLowerCase())
        ) {
          filterDataMatch.push(...data.values);
        }
        return;
      } else {
        return;
      }
      if (data.isLast) {
        isLast = data.isLast;
      } else {
        isLast = false; 
        i += 50
      }
    } catch (err) {
      console.log(err);
    }
  } while (isLast == false);

  return filterDataMatch;
};

const refineDetails = async (allFilterDetails) => {
  const refinedFilterDetails = allFilterDetails.map(
    ({ id, name, description, owner, jql, viewUrl, searchUrl }) => ({
      id,
      name,
      description: description ? description : " ",
      owner: owner.displayName,
      viewUrl,
      jql,
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
