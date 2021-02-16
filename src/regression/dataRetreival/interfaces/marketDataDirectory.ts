import MarketDataSource from "../marketDataSource";

interface MarketDataFile {
    endDate: string;
    startDate: string;
    fileName: string;
    source: MarketDataSource
}

export { MarketDataFile };