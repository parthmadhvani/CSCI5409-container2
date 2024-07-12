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

app.listen(PORT, () => {
    console.log(`Container 2 is running on port ${PORT}`);
});

//testing
//testing1234
//tesing-abcd