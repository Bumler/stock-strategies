import _ from "lodash";
import { Moment } from "moment";
import { TradeAction } from "./regressionStrategy";

class Position {
    sharesRemaining: number;
    orderHistory: Order[];

    currentSharePrice: number;
    relativeHigh: number;
    relativeLow: number;
    
    constructor(){
        this.sharesRemaining = 0;
        this.currentSharePrice = 0;
        this.relativeHigh = 0;
        this.relativeLow = 0;

        this.orderHistory = [];
    }

    /*
        Profit, gain and money in will all need to be implemented
        in a seperate calculator class. They're values depend on
        lifo, fifo or some sort of sale strategy.
    */

    //this needs to be deprecated but gives me a flat amount to work with
    //for regressions with only one action.
    grossProfit = () => this.sharesSold() * this.marketValue();

    marketValue = () => this.sharesHeld() * this.currentSharePrice;
    sharesHeld = () => this.sharesPurchased() - this.sharesSold();
    
    private sharesPurchased = () => this.sumIf( TradeAction.BUY );
    private sharesSold = () => this.sumIf( TradeAction.SELL );

    private sumIf = (action: TradeAction): number => {
        let sum = 0;

        _.forEach(this.orderHistory, it => {
            sum += it.action === action ? it.shares : 0;
        });

        return sum;
    }
}

interface Order {
    action: TradeAction;
    shares: number;
    cost: number;
    time: Moment;
}

export { Position, Order };