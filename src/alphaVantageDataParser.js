const fs = require('fs');

const TIME = 0;
const OPEN = 1;
const HIGH = 2;
const LOW = 3;
const CLOSE = 4;
const VOLUME = 5;

function parseCSV(fileName){
    const lines = fs.readFileSync(fileName, 'utf-8').split("\r\n").splice(1);
    
    return lines.map(line => {
        const l = line.split(',');
        return { time: l[TIME], open: l[OPEN], high: l[HIGH], low: l[LOW], 
            close: l[CLOSE], volume: l[VOLUME]};
    });
}

module.exports = { parseCSV };