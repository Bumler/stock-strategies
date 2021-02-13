const { default: axios } = require('axios');
const moment = require('moment');

const INTERVAL = "1min";
const API_KEY = "FS1PD12N58WMCZF4";
const FUNCTION = "TIME_SERIES_INTRADAY_EXTENDED";

const source = "alphaVantage";
let instance = null;

async function retrieveDataForDate(symbol, date){
    const slice = getSlice(date);
    const params = {
        symbol, slice,
        interval: INTERVAL,
        apikey: API_KEY,
        function: FUNCTION
    };

    console.log(`Querying AlphaVantage for ${symbol} at slice ${slice}`)
    return await getClient().get("/query", { params })
        .then( function (response) {
            console.log("DATA RETRIEVED");
            return response.data;
        }).catch( function (err) {
            console.log(err)
            throw err;
        });
}

function getClient(){
    if (!instance){
        instance = axios.create({
            baseURL: 'https://www.alphavantage.co',
            timeout: 180000,
          });
    }

    return instance;
}

function getSlice(date){
    const yesterday = moment().subtract(1, 'd').hours(20).minutes(0).seconds(0);
    const duration = moment.duration(yesterday.diff(date));
    
    const day = duration.asDays();
    const months = Math.trunc(day / 30);

    const sliceYear = Math.trunc(months/12) + 1;
    const sliceMonth = (months + 1) - (12 * (sliceYear - 1));

    return `year${sliceYear}month${sliceMonth}`;
}

module.exports = { retrieveDataForDate, source };