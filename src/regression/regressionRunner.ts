import { Moment } from "moment";
import ParsedMarketData from "./dataRetreival/interfaces/parsedMarketData";
import { RegressionOutcome } from "./dataRetreival/interfaces/regressionOutcome";
import { RegressionStrategy } from "./dataRetreival/interfaces/regressionStrategy";

class RegressionRunner {
    regressionOutcomes: RegressionOutcome[]
    startDate: Moment;

    constructor(regressionOutcomes: RegressionOutcome[], startDate: Moment) {
        this.regressionOutcomes = regressionOutcomes;
        this.startDate = startDate;
    }

    public run = () => {
        //Gets next line of market data
        //Iterates through all regression outcomes calling step 
        //until no shares remain in any outcome
    }

    getNextDataChunk = () => {}
    applyStrategy = (regressionOutcome: RegressionOutcome, marketData: ParsedMarketData) => {}
}

export default RegressionRunner;