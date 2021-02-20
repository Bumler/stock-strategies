import _ from "lodash";
import { Moment } from "moment";
import ParsedMarketData from "./dataRetreival/interfaces/parsedMarketData";
import { Position } from "./dataRetreival/interfaces/position";
import { RegressionStrategy } from "./dataRetreival/interfaces/regressionStrategy";

class RegressionRunner {
    public regressionOutcomes: RegressionOutcome[]
    startDate: Moment;

    constructor(regressionInput: RegressionInput) {
        
        this.regressionOutcomes = this.initOutcomes(regressionInput.strategies);
        this.startDate = regressionInput.startDate;
    }

    private initOutcomes = (strategies: RegressionStrategy[]): RegressionOutcome[] => 
        _.map(strategies, it => {return {strategy: it, position: new Position()}});

    public step = () => {
        //Gets next line of market data
        //Iterates through all regression outcomes calling step 
        //until no shares remain in any outcome
    }

    getNextDataChunk = () => {}
    applyStrategy = (regressionOutcome: Position, marketData: ParsedMarketData) => {}
}

interface RegressionInput{
    strategies: RegressionStrategy[],
    startDate: Moment,
    initialCapital: number
}

interface RegressionOutcome{
    position: Position;
    strategy: RegressionStrategy;
}

export default RegressionRunner;