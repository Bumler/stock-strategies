import { AxiosInstance } from "axios";
import MarketDataSource from "../marketDataSource";

import { default as axios } from 'axios';
import moment, { Moment } from 'moment';
import DataClient from "../interfaces/dataClient";

const INTERVAL = "1min";
const API_KEY = "FS1PD12N58WMCZF4";
const FUNCTION = "TIME_SERIES_INTRADAY_EXTENDED";

class AlphaVantageClient implements DataClient{
    public source = MarketDataSource.alphaVantage;
    instance: AxiosInstance;

    constructor(){
        this.instance = axios.create({
            baseURL: 'https://www.alphavantage.co',
            timeout: 180000,
        });
    }

    retrieveDataForDate = async (symbol: string, date: Moment): Promise<string> => {
        const slice = this.getSlice(date);
        const params = {
            symbol, slice,
            interval: INTERVAL,
            apikey: API_KEY,
            function: FUNCTION
        };
    
        console.log(`Querying AlphaVantage for ${symbol} at slice ${slice}`)
        return await this.instance.get("/query", { params })
            .then( function (response) {
                console.log("DATA RETRIEVED");
                return response.data;
            }).catch( function (err) {
                console.log(err)
                throw err;
            });
    }

    getSlice = (date: Moment): string => {
        const yesterday = moment().subtract(1, 'd').hours(20).minutes(0).seconds(0);
        const duration = moment.duration(yesterday.diff(date));
        
        const day = duration.asDays();
        const months = Math.trunc(day / 30);
    
        const sliceYear = Math.trunc(months/12) + 1;
        const sliceMonth = (months + 1) - (12 * (sliceYear - 1));
    
        return `year${sliceYear}month${sliceMonth}`;
    }
}

export default AlphaVantageClient;