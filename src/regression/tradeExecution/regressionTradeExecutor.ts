import { Position } from "../dataRetreival/interfaces/position";
import { ConditionalTrade, TradeAction } from "../dataRetreival/interfaces/regressionStrategy";

export function executeTrade(trade: ConditionalTrade, position: Position){
    const order = {
        action: trade.action,
        shares: position.sharesHeld() * trade.sharesToTrade,
        cost: position.currentSharePrice,
        time: position.lastUpdated
    };

    position.orderHistory.push(order);
}

export function executeInitialPurchase(initialCapital: number, position: Position){
    const order = {
        action: TradeAction.BUY,
        shares: initialCapital / position.currentSharePrice,
        cost: position.currentSharePrice,
        time: position.lastUpdated
    };

    position.orderHistory.push(order);
}