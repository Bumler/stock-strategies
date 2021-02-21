import _ from "lodash";
import { Moment } from "moment";
import CachedDataRetriever from "./dataRetreival/cachedDataRetriever";
import ParsedMarketData from "./dataRetreival/interfaces/parsedMarketData";
import { Position } from "./dataRetreival/interfaces/position";
import { RegressionStrategy } from "./dataRetreival/interfaces/regressionStrategy";
import MarketDataRetreiver from "./dataRetreival/marketDataRetriever";
import { selectStrategy } from "./tradeExecution/conditionalTradeSelector";

class RegressionRunner {
    public regressionOutcomes: RegressionOutcome[];
    public cachedMarketData: CachedDataRetriever;
    startDate: Moment;

    constructor(regressionInput: RegressionInput) {
        this.cachedMarketData = new CachedDataRetriever(regressionInput.symbol, regressionInput.startDate, regressionInput.marketDataRetreiver)
        this.regressionOutcomes = this.initOutcomes(regressionInput.strategies);
        this.startDate = regressionInput.startDate;
    }

    private initOutcomes = (strategies: RegressionStrategy[]): RegressionOutcome[] => 
        _.map(strategies, it => {return {strategy: it, position: new Position()}});

    public step = async (): Promise<StepResult> => {
        //Gets next line of market data
        const marketData = await this.cachedMarketData.getNextMarketData();

        //todo add no shares held
        if(!marketData){
            return {isComplete: true}; //need to figure out how we want to indicate we're finished.
        }

        _.forEach(this.regressionOutcomes, it => this.applyStrategy(it, marketData));
        return {isComplete: false};
    }

    applyStrategy = (regressionOutcome: RegressionOutcome, marketData: ParsedMarketData) => {
        const strategy = selectStrategy(regressionOutcome, marketData);
        //execute it.
    }
}

interface StepResult{
    isComplete: boolean;
}

interface RegressionInput{
    strategies: RegressionStrategy[],
    startDate: Moment,
    initialCapital: number,
    symbol: string,
    marketDataRetreiver: MarketDataRetreiver
}

interface RegressionOutcome{
    position: Position;
    strategy: RegressionStrategy;
}

export {RegressionRunner, RegressionOutcome};