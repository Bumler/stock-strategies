const fs = require('fs');

const TIME = 0;
const OPEN = 1;
const HIGH = 2;
const LOW = 3;
const CLOSE = 4;
const VOLUME = 5;

function parseCSV(rawData){
    const lines = rawData.split("\r\n");
    removeLeadingAndTrailingLine(lines);

    return lines.map(line => {
        const l = line.split(',');
        return { time: l[TIME], open: l[OPEN], high: l[HIGH], low: l[LOW], 
            close: l[CLOSE], volume: l[VOLUME]};
    });
}

function removeLeadingAndTrailingLine(lines){
    lines.shift();
    lines.pop();
}

module.exports = { parseCSV };