interface ParsedMarketData{
    // Because we currently are storing stocks in a text file, I feel a string is the easiest way to store time. 
    // There will likely be a large ripple effect when this data is backed by a db but I'm willing to accept that tradeoff 
    // for the timebeing.
    time: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
}

export default ParsedMarketData;