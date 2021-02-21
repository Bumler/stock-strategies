import { Moment } from "moment";
import { Position } from "../dataRetreival/interfaces/position";
import { ConditionalTrade } from "../dataRetreival/interfaces/regressionStrategy";

export function executeTrade(trade: ConditionalTrade, position: Position, tradeDate: Moment){
    const order = {
        action: trade.action,
        shares: position.sharesHeld() * trade.sharesToTrade,
        cost: position.currentSharePrice,
        time: tradeDate
    };

    position.orderHistory.push(order);
}