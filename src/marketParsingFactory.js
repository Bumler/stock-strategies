const alphaVantageParse = require('./alphaVantageDataParser').parseCSV;

function parseMarketData(rawData, source){
    if (source = "alphaVantage")
        return alphaVantageParse(rawData);
}

module.exports = { parseMarketData };