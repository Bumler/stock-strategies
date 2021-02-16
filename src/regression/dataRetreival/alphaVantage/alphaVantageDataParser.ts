import ParsedMarketData from '../interfaces/parsedMarketData';

const TIME = 0;
const OPEN = 1;
const HIGH = 2;
const LOW = 3;
const CLOSE = 4;
const VOLUME = 5;

const parseCSV = (rawData: string): ParsedMarketData[] => {
    const lines = rawData.split("\r\n");
    removeLeadingAndTrailingLine(lines);

    return lines.map(line => {
        const l = line.split(',');
        return { 
            time: l[TIME], 
            open: +l[OPEN], 
            high: +l[HIGH], 
            low: +l[LOW], 
            close: +l[CLOSE], 
            volume: +l[VOLUME]
        };
    });
}

const removeLeadingAndTrailingLine = (lines: string[]) => {
    lines.shift();
    lines.pop();
}

export default parseCSV;