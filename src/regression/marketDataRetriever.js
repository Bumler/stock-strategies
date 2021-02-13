const fs = require('fs');
const _ = require('lodash');
const moment = require('moment');
const client = require('./alphaVantageClient.js');
const { parseMarketData } = require('./marketParsingFactory.js');

const MARKET_DATA_DIRECTORY_PATH = './resources/marketDataFileDirectory.json';

//todo validation on date should be < 24 months and not after today.
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
    
    const retrievedData = await client.retrieveDataForDate(symbol, date);

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
    const fileName = `${symbol}/${symbol}-${date.replace(/:/g, "-")}.csv`;

    ensureDirectoryExistence(createPath(symbol));

    console.log(`Writing market data to ${fileName}`);
    //this may cause an issue if we query for the same date while querying a symbol
    fs.writeFile(createPath(fileName), retrievedData, err => writeCallback(err));
    return fileName;
}

function ensureDirectoryExistence(dirPath) {
    if (fs.existsSync(dirPath)) {
      return true;
    }

    console.log(`Creating directory ${dirPath}`);
    fs.mkdirSync(dirPath);
  }

function updateDataFileDirectory(marketDataFileDirectory, symbol, fileName, parsedData){
    let marketDataForSymbol = getMarketDataForSymbol(marketDataFileDirectory, symbol);

    const newFileInfo = {
        endDate: _.head(parsedData).time,
        startDate: _.last(parsedData).time,
        source: client.source,
        fileName,
    };
    console.log(`Adding new market data to directory\n${JSON.stringify(newFileInfo)}`);

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
    if( err )
        console.error(err);
}

module.exports = { getMarketDataFile };