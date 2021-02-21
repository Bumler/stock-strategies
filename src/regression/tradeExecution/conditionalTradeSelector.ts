import _ from "lodash";
import ParsedMarketData from "../dataRetreival/interfaces/parsedMarketData";
import { ConditionalTrade } from "../dataRetreival/interfaces/regressionStrategy";
import { RegressionOutcome } from "../regressionRunner";
import { shouldExecuteClassicOrder } from "./classicOrderSelector";

export function selectStrategy(regressionOutcome: RegressionOutcome, marketData: ParsedMarketData): ConditionalTrade | undefined {
    const {position, strategy} = regressionOutcome;
    
    return _.find(strategy.conditions, condition => {
        return shouldExecuteClassicOrder(condition.order, condition.action, position);
    });
}