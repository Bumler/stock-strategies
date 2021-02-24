import moment from "moment-business-days";
import { Moment } from "moment";
import ParsedMarketData from "./interfaces/parsedMarketData";
import { MarketDataRetreiver } from "./marketDataRetriever";
import _ from "lodash";

class CachedDataRetriever {
    cachedMarketData: ParsedMarketData[] | undefined;
    nextIndex: number | undefined;
    symbol: string;
    currentDate: Moment;
    marketDataRetreiver: MarketDataRetreiver;

    constructor(symbol: string, startDateString: Moment, marketDataRetreiver: MarketDataRetreiver){
        this.symbol = symbol;
        this.currentDate = startDateString;
        this.marketDataRetreiver = marketDataRetreiver;
     }

    public getNextMarketData = async (): Promise<ParsedMarketData | null> => {
        if(this.nextIndex && this.cachedMarketData && this.nextIndex < this.cachedMarketData.length){
            const data = this.cachedMarketData[this.nextIndex];
            this.nextIndex++;
            this.currentDate = moment(data.time);
            return data;
        }
        else{
            const queryDateForNextChunk = this.getQueryDate();
            this.cachedMarketData = await this.marketDataRetreiver.getMarketDataFile(this.symbol, queryDateForNextChunk);
            
            const head = _.head(this.cachedMarketData);
            const last = _.last(this.cachedMarketData);

            if (!head || !last){
                return null; 
            }

            const firstDate = moment(head.time);
            if (this.currentDate.isBefore(moment(head.time))){
                this.nextIndex = 1;
                this.currentDate = firstDate;
                return head;
            } 
            
            var currentIndex = 0;
            this.nextIndex = 1;

            while(this.nextIndex < this.cachedMarketData.length){
                const current = this.cachedMarketData[currentIndex];
                const next = this.cachedMarketData[this.nextIndex];

                if(this.isBetweenStartInclusive(this.currentDate, current, next)){
                    this.currentDate = moment(current.time);
                    return current;
                }

                currentIndex++;
                this.nextIndex++;
            }
            
            const lastDate = moment(head.time);
            this.currentDate = lastDate;
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
            ? this.currentDate 
            : this.currentDate.businessAdd(1);
}

export default CachedDataRetriever;