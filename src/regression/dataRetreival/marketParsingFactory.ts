import MarketDataSource from "./marketDataSource";
import ParsedMarketData from './interfaces/parsedMarketData';
import alphaVantageParse from './alphaVantage/alphaVantageDataParser';

const parseMarketData = (rawData: string, source: MarketDataSource): ParsedMarketData[] => {
    if (source === MarketDataSource.alphaVantage)
        return alphaVantageParse(rawData);

    return new Array<ParsedMarketData>();
}

export default parseMarketData;