import { Moment } from "moment";
import { TradeAction } from "./regressionStrategy";

interface RegressionOutcome {
    sharesRemaining: number;
    orderHistory: Order[];

    currentSharePrice: number;
    relativeHigh: number;
    relativeLow: number;
    
    profit(): number;
    moneyIn(): number;
    marketValue(): number;
    gain(): number; //profit + marketValue - moneyIn
}

interface Order {
    action: TradeAction;
    shares: number;
    cost: number;
    time: Moment;
}

export { RegressionOutcome, Order };