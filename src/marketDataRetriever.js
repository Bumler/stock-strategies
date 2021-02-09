const fs = require('fs');
const _ = require('lodash');
const moment = require('moment');

function getMarketData(symbol, date){
    const fileKey = JSON.parse(fs.readFileSync('./resources/key.json'));
    console.log(fileKey);
    const marketDataForSymbol = fileKey.marketDataLocations[symbol.toUpperCase()];
    console.log(marketDataForSymbol);

    const dataForDate = _.first(marketDataForSymbol, function(data){
        return moment(date).isBetween(data.startDate, data.endDate);
    });

    if (dataForDate){
        console.log(dataForDate.fileName);
        return dataForDate.fileName;
    }

    console.log("poop");
}

console.log("starting");
getMarketData("GME", "2021-01-25 06:00:00");