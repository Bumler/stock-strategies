import moment from "moment-business-days";
import { Moment } from "moment";
import ParsedMarketData from "./interfaces/parsedMarketData";
import MarketDataRetreiver from "./marketDataRetriever";
import _ from "lodash";

class CachedDataRetriever {
    cachedMarketData: ParsedMarketData[] | undefined;
    nextIndex: number | undefined;
    symbol: string;
    currentDateString: string;
    marketDataRetreiver: MarketDataRetreiver;

    constructor(symbol: string, startDateString: string, marketDataRetreiver: MarketDataRetreiver){
        this.symbol = symbol;
        this.currentDateString = startDateString;
        this.marketDataRetreiver = marketDataRetreiver;
     }

    public getNextMarketData = async (dateString: string): Promise<ParsedMarketData> => {
        if(this.nextIndex && this.cachedMarketData && this.nextIndex < this.cachedMarketData.length){
            const data = this.cachedMarketData[this.nextIndex];
            this.nextIndex++;
            this.currentDateString = data.time;
            return data;
        }
        else{
            const asDate = moment(dateString);

            const queryDateForNextChunk = this.getQueryDate();
            this.cachedMarketData = await this.marketDataRetreiver.getMarketDataFile(this.symbol, queryDateForNextChunk);
            
            const head = _.head(this.cachedMarketData);
            const last = _.last(this.cachedMarketData);

            if (!head || !last){
                throw new Error(`No data found for ${this.symbol} at ${dateString}`); 
            }

            if (asDate.isBefore(moment(head.time))){
                this.nextIndex = 1;
                return head;
            } 
            
            var currentIndex = 0;
            this.nextIndex = 1;

            while(this.nextIndex < this.cachedMarketData.length){
                const current = this.cachedMarketData[currentIndex];
                const next = this.cachedMarketData[this.nextIndex];

                if(this.isBetweenStartInclusive(asDate, current, next)){
                    this.currentDateString = current.time;
                    return current;
                }

                currentIndex++;
                this.nextIndex++;
            }
            
            return last;
        }
    }

    private isBetweenStartInclusive = (asDate: Moment, current: ParsedMarketData, next: ParsedMarketData): boolean => {
        return asDate.isBetween(current.time, next.time, undefined, "(]")
    }

    //If no cached market data exists use the current date string unaltered
    //If we are getting the next chunk of data need to increment by one business day.
    private getQueryDate = (): Moment =>
        !this.cachedMarketData 
            ? moment(this.currentDateString) 
            : moment(this.currentDateString).businessAdd(1);
}

export default CachedDataRetriever;