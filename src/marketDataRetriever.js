const fs = require('fs');
const _ = require('lodash');
const moment = require('moment');

function getMarketDataFile(symbol, date){
    const fileKey = JSON.parse(fs.readFileSync('./resources/key.json'));
    const marketDataForSymbol = fileKey.marketDataLocations[symbol.toUpperCase()];

    const dataForDate = marketDataForSymbol.find(data => moment(date).isBetween(moment(data.startDate), moment(data.endDate)));

    return dataForDate ? dataForDate : retrieveDataForDate(symbol, date);
}

function retrieveDataForDate(symbol, date){
    getSlice(date);
    return "";
}

function getSlice(date){
    const yesterday = moment().subtract(1, 'd').hours(20).minutes(0).seconds(0);
    console.log(yesterday);
    const duration = moment.duration(yesterday.diff(date));
    
    const day = duration.asDays();
    const months = Math.trunc(day / 30);

    const sliceYear = Math.trunc(months/12) + 1;
    const sliceMonth = (months + 1) - (12 * (sliceYear - 1));
    
    return `year${sliceYear}month${sliceMonth}`;
}

function dummyClient(slice){
    if ("year1month3" === slice)
        return "aa,bb\n11,22";
    return null;
}

//where yesterday is Moment<2021-02-09T20:00:00-08:00>
console.log("month 1");
getMarketDataFile("GME", "2021-02-09 20:00:00");
getMarketDataFile("GME", "2021-01-11 04:08:00");

console.log("month 2");
getMarketDataFile("GME", "2020-12-14 04:04:00");
getMarketDataFile("GME", "2021-01-08 20:00:00");

console.log("month 3");
getMarketDataFile("GME", "2020-11-12 04:12:00");
getMarketDataFile("GME", "2020-12-11 19:57:00");

console.log("month 4");
getMarketDataFile("GME", "2020-11-11 20:00:00");
getMarketDataFile("GME", "2020-10-13 06:36:00");

console.log("month 24");
getMarketDataFile("GME", "2019-03-22 17:23:00");
getMarketDataFile("GME", "2019-02-21 07:51:00");

module.exports = { getMarketDataFile };