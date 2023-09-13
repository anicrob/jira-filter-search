const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const fs = require("fs");

const filterDataMatch = [];

const searchFilters = async () => {
  const index = [
    0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1300,
    1400, 1500, 1600, 1700, 1800, 1900, 2000,
  ];
  await Promise.all(
    index.map(async (i) => {
      try {
        const response = await fetch(
          `${process.env.URL}/rest/api/3/filter/search/?startAt=${i}`,
          {
            method: "GET",
            headers: {
              Authorization: `Basic ${process.env.API_KEY}`,
              Accept: "application/json",
            },
          }
        );
        const { values } = await response.json;
        if (values.length === 0) {
          return filterDataMatch;
        } 
        console.log(values);
          const matches = values.filter(({ jql }) => {
            !!jql.includes(`${process.env.SEARCH_KEYWORD}`);
          });
          filterDataMatch.push(matches); 
      } catch (err) {
        console.log(err);
      }
    })
  );
};
searchFilters();

// const refineDetails = async (allFilterDetails) => {
//   const refinedFilterDetails = allFilterDetails.map(
//     ({ id, name, description, owner, jql, viewUrl }) => ({
//       id,
//       name,
//       description: description ? description : " ",
//       owner: owner.displayName,
//       jql,
//       viewUrl,
//     })
//   );
//   return refinedFilterDetails;
// };

// const returnCSV = async (data, fileName) => {
//   if (data.length > 0) {
//     const csvRows = [];
//     //get the headers (properties) from the first object in the data array
//     const headers = Object.keys(data[0]);
//     //add the headers to the csvRows array, joined by a comma
//     csvRows.push(headers.join(","));
//     // Loop to get value of each object's key
//     for (const row of data) {
//       const values = headers.map((header) => {
//         const val = row[header];
//         return `"${val}"`;
//       });

//       // To add, separator between each value
//       csvRows.push(values.join(","));
//     }

//     //To add new line for each object's value
//     const finalData = csvRows.join("\n");

//     // use fs.writeFile to create the .csv file
//     fs.writeFile(`${fileName}.csv`, finalData, { encoding: "utf8" }, (err) => {
//       if (err) {
//         console.log(err);
//         return;
//       }
//     });

//     console.log(`${fileName}.csv has been successfully created!`);
//   } else {
//     console.log(
//       `there are no ${fileName} owned by inactive users in this instance`
//     );
//     return;
//   }
// };

// module.exports = {
//   getInactiveUsers,
//   findInactiveUserDashboards,
//   findInactiveUserFilters,
//   returnCSV,
// };
