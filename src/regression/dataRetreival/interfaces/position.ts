import _ from "lodash";
import moment from "moment";
import { Moment } from "moment";
import ParsedMarketData from "./parsedMarketData";
import { TradeAction } from "./regressionStrategy";

class Position {
    orderHistory: Order[];

    currentSharePrice: number;
    relativeHigh: number;
    relativeLow: number;
    lastUpdated: Moment;
    
    constructor(){
        this.currentSharePrice = 0;
        this.relativeHigh = 0;
        this.relativeLow = Number.MAX_SAFE_INTEGER;
        this.lastUpdated = moment();

        this.orderHistory = [];
    }

    public update(marketData: ParsedMarketData){
        //we could potentially split up the share price to be a function
        //that returns close, current, high but I don't see use case 
        //for that yet and won't be hard to refactor.
        this.currentSharePrice = marketData.close; 
        this.relativeHigh = Math.max(marketData.high, this.relativeHigh);
        this.relativeLow = Math.max(marketData.low, this.relativeLow);
        this.lastUpdated = moment(marketData.time);
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