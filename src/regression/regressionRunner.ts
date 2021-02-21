import _ from "lodash";
import { Moment } from "moment";
import CachedDataRetriever from "./dataRetreival/cachedDataRetriever";
import ParsedMarketData from "./dataRetreival/interfaces/parsedMarketData";
import { Position } from "./dataRetreival/interfaces/position";
import { RegressionStrategy } from "./dataRetreival/interfaces/regressionStrategy";
import MarketDataRetreiver from "./dataRetreival/marketDataRetriever";
import { selectStrategy } from "./tradeExecution/conditionalTradeSelector";
import { executeInitialPurchase, executeTrade } from "./tradeExecution/regressionTradeExecutor";

export class RegressionRunner {
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

    public initialPurchase = async (initialCapital: number) => {
        const marketData = await this.cachedMarketData.getNextMarketData();

        if (!marketData){
            throw new Error(`No market data found for ${this.cachedMarketData.symbol}`);
        }

        _.forEach(this.regressionOutcomes, it => {
            it.position.update(marketData);
            executeInitialPurchase(initialCapital, it.position);
        });
    }

    public step = async (): Promise<StepResult> => {
        const marketData = await this.cachedMarketData.getNextMarketData();

        if(!marketData || anySharesRemaining(this.regressionOutcomes)){
            return {isComplete: true}; //need to figure out how we want to indicate we're finished.
        }

        _.forEach(this.regressionOutcomes, it => {
            it.position.update(marketData);
            applyStrategy(it, marketData);
        });
        return {isComplete: false};
    }
}

function applyStrategy (regressionOutcome: RegressionOutcome, marketData: ParsedMarketData) {
    const strategy = selectStrategy(regressionOutcome, marketData);
    if(strategy){
        executeTrade(strategy, regressionOutcome.position);
    }
}

function anySharesRemaining(regressionOutcomes: RegressionOutcome[]){
    _.some(regressionOutcomes, it => it.position.sharesHeld() >= 1);
}

export interface StepResult{
    isComplete: boolean;
}

export interface RegressionInput{
    strategies: RegressionStrategy[],
    startDate: Moment,
    initialCapital: number,
    symbol: string,
    marketDataRetreiver: MarketDataRetreiver
}

export interface RegressionOutcome{
    position: Position;
    strategy: RegressionStrategy;
}
