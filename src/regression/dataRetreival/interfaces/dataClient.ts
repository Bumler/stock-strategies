import MarketDataSource from "../marketDataSource";

interface DataClient {
    source: MarketDataSource;
    retrieveDataForDate(symbol: string, date: string): Promise<string>;
}

export default DataClient;