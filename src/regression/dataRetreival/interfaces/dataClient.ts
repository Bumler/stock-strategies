import { Moment } from "moment";
import MarketDataSource from "../marketDataSource";

interface DataClient {
    source: MarketDataSource;
    retrieveDataForDate(symbol: string, date: Moment): Promise<string>;
}

export default DataClient;