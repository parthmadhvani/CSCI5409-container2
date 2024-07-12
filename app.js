const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const app = express();
app.use(bodyParser.json());

const PORT = Number(process.env.PORT) || 7000;
const FILE_DIR = process.env.FILE_DIRECTORY || "/parth_PV_dir";

app.post('/calculate', (req, res) => {

    const { file, product } = req.body;
    const filePath = path.join(FILE_DIR,file);
    const fileExtension = path.extname(file);

    // if (fileExtension !== '.csv') {
    //     return res.json({ file, error: 'Input file not in CSV format.' });
    // }

    let sum = 0;
    let headerLength = 0;
    let isFileEmpty = true;

    try {
        fs.createReadStream(filePath)
            .on('error', (err) => {
                console.log(`Error reading file: ${err.message}`);
                return res.json({ file, error: 'File not found.' });
            })
            .pipe(csv())
            .on('headers', (headers) => {
                isFileEmpty = false;
                headerLength = headers.length;
                if (!headers || headerLength === 0) {
                    return res.json({ file, error: 'Input file not in CSV format.' });
                }
            })
            .on('data', (data) => {
                const trimmedData = Object.keys(data).reduce((acc, key) => {
                    acc[key.trim()] = data[key].trim();
                    return acc;
                }, {});

                if (Object.keys(trimmedData).length !== headerLength) {
                    return res.json({ file, error: 'Input file not in CSV format.' });
                }

                if (trimmedData.product === product) {
                    sum += parseInt(trimmedData.amount, 10);
                }
            })
            .on('end', () => {
                if (isFileEmpty) {
                    return res.json({ file, error: 'Input file not in CSV format.' });
                }

                if(sum == 0 && fileExtension!=='.csv'){
                    return res.json({ file, error: 'Input file not in CSV format.' });  
                }

                return res.json({ file, sum });
            });
    } catch (error) {
        console.error(`Unexpected error: ${error.message}`);
        return res.json({ file, error: 'File not found.' });
    }
});

//const PORT = 7000;
app.listen(PORT, () => {
    console.log(`Container 2 is running on port ${PORT}`);
});



// const express = require("express");
// const path = require("path");
// const csvParser = require("csv-parser");
// const fs = require("fs");
// const dotenv = require("dotenv");

// const app = express();

// app.use(express.json());
// dotenv.config();

// const PORT = Number(process.env.PORT) || 2000;
// const FILE_DIRECTORY = process.env.FILE_DIRECTORY || "../";

// console.log({ FILE_DIRECTORY })
// console.log({ PORT })
// console.log("cicd testing.............")
// console.log("cicd testing.33333............")
// console.log("cicd testing.3334444433............")
// console.log("cicd testing.33344444333333333............")
// console.log("cicd testing.33344444333333334443............")
// console.log("cicd testing.333444443333333344438888888............")
// console.log("cicd testing.33344444333333334443............")
// console.log("cicd testing.33344444333333334443 non functional............")







// app.post("/parser", (req, res) => {

//     const { file, product } = req.body;
//     const results = [];

//     const isValidCSV = (filePath) => {
//         return new Promise((resolve, reject) => {
//             try {
//                 let isValid = true;
//                 fs.createReadStream(filePath)
//                     .pipe(csvParser({
//                         mapHeaders: ({ header }) => header.trim()
//                     }))
//                     .on('data', (data) => {
//                         if (!isValid) return;
//                         if (Object.keys(data).length === 0) {
//                             isValid = false;
//                         }
//                         results.push(data)
//                     })
//                     .on('end', () => resolve(isValid))
//                     .on('error', (err) => reject(err));
//             } catch (err) {
//                 return false;
//             }
//         });
//     };

//     (async () => {
//         const filePath = path.join(FILE_DIRECTORY, file);
//         const fileExtension = path.extname(file).toLowerCase();

//         try {
//             const isValid = await isValidCSV(filePath);
//             let sum = 0;
//             for (let i = 0; i < results.length; i++) {
//                 if (results[i].product === product) {
//                     sum += Number(results[i].amount);
//                 }
//             }

//             if (fileExtension === '.yml' && sum == 0) {
//                 console.log('The file is not a CSV.');
//                 return res.send({
//                     file,
//                     error: "Input file not in CSV format."
//                 });
//             }
//             console.log("2:", isValid)
//             if (isValid) {
//                 console.log('The file is a valid CSV.');
//                 res.status(200).send({
//                     file,
//                     sum
//                 });
//             } else {
//                 console.log('The file is not a valid CSV.');
//                 res.send({
//                     file,
//                     error: "Input file not in CSV format."
//                 });
//             }
//         } catch (err) {
//             console.error('Error checking CSV format:', err);
//             res.status(500).send({ error: 'Error checking CSV format.' });
//         }

//     })();

// });

// app.listen(PORT, () => {
//     // console.log(Listening on port ${PORT}...!);
// })
