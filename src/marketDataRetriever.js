const fs = require('fs');
const _ = require('lodash');
const moment = require('moment');
const client = require('./alphaVantageClient.js');
const { parseMarketData } = require('./marketParsingFactory.js');

const MARKET_DATA_DIRECTORY_PATH = './resources/marketDataFileDirectory.json';

async function getMarketDataFile(symbol, date){
    console.log("starting");
    const marketDataFileDirectory = JSON.parse(fs.readFileSync(MARKET_DATA_DIRECTORY_PATH));

    const fileInfoForDate = getMarketDataForSymbol(marketDataFileDirectory, symbol)
        .find(data => moment(date).isBetween(moment(data.startDate), moment(data.endDate)));

    if (fileInfoForDate){
        console.log(`Already have market data for ${symbol} during ${date}`)
        const rawData = fs.readFileSync(createPath(fileInfoForDate.fileName), 'utf-8');
        return parseMarketData(rawData);
    }
    
    console.log(`Retrieving data for ${symbol}`)
    const retrievedData = await client.retrieveDataForDate(symbol, date);

    console.log("DATA RETRIEVED");
    console.log(retrievedData);

    const fileName = writeMarketDataToFile(symbol, date, retrievedData);
    const parsedData = parseMarketData(retrievedData, client.source);
    updateDataFileDirectory(marketDataFileDirectory, symbol, fileName, parsedData);
    
    return parsedData;
}

function createPath(fileName){
    return `./resources/${fileName}`;
}

function getMarketDataForSymbol(marketDataFileDirectory, symbol){
    console.log(symbol);
    return marketDataFileDirectory.marketDataLocations[symbol.toUpperCase()] || [];
}

function writeMarketDataToFile(symbol, date, retrievedData) {
    const fileName = `${symbol}/GENERATED${symbol}-${date.replace(/:/g, "-")}.csv`;
    
    console.log(`Writing market data to ${fileName}`);
    //this may cause an issue if we query for the same date while querying a symbol
    fs.writeFile(createPath(fileName), retrievedData, err => writeCallback(err));
    return fileName;
}

function updateDataFileDirectory(marketDataFileDirectory, symbol, fileName, parsedData){
    let marketDataForSymbol = getMarketDataForSymbol(marketDataFileDirectory, symbol);
    
    console.log("heloo");
    console.log(parsedData);

    const newFileInfo = {
        endDate: _.head(parsedData).time,
        startDate: _.last(parsedData).time,
        source: client.source,
        fileName,
    };

    if (_.isEmpty(marketDataForSymbol)){
        marketDataFileDirectory.marketDataLocations[symbol.toUpperCase()] = [newFileInfo];
    }
    else {
        marketDataForSymbol.push(newFileInfo);
    }

    const asJson = JSON.stringify(marketDataFileDirectory);
    fs.writeFile(MARKET_DATA_DIRECTORY_PATH, asJson, err => writeCallback(err));
}

function writeCallback(err){
    console.log("test");
    console.error(err);
}
//todo these should be unit tests :P
// //where yesterday is Moment<2021-02-09T20:00:00-08:00>
// console.log("month 1");
// getMarketDataFile("GME", "2021-02-09 20:00:00");
// getMarketDataFile("GME", "2021-01-11 04:08:00");

// console.log("month 2");
// getMarketDataFile("GME", "2020-12-14 04:04:00");
// getMarketDataFile("GME", "2021-01-08 20:00:00");

// console.log("month 3");
// getMarketDataFile("GME", "2020-11-12 04:12:00");
// getMarketDataFile("GME", "2020-12-11 19:57:00");

// console.log("month 4");
// getMarketDataFile("GME", "2020-11-11 20:00:00");
// getMarketDataFile("GME", "2020-10-13 06:36:00");

// console.log("month 24");
// getMarketDataFile("GME", "2019-03-22 17:23:00");
// getMarketDataFile("GME", "2019-02-21 07:51:00");

(async () => {
    var text = await getMarketDataFile("GME", "2021-02-05 20:00:00");
})().catch(e => {
    // Deal with the fact the chain failed
});

module.exports = { getMarketDataFile };