import { Position } from "../dataRetreival/interfaces/position";
import { ClassicOrder, ClassicOrderType, SupportedOrder, SupportedOrderType, TradeAction } from "../dataRetreival/interfaces/regressionStrategy";
    
export function shouldExecuteClassicOrder (order: SupportedOrder, action: TradeAction, position: Position): boolean{
    if(!isClassicOrder(order)){
        return false;
    }

    switch (order.tradeCondition) {
        case ClassicOrderType.TRAILING_STOP:
            return meetsTrailingStop(order, action, position); 
    
        default:
            return false;
    }
}

function isClassicOrder(order: SupportedOrder): order is ClassicOrder {
    return order.type === SupportedOrderType.CLASSIC_ORDER;
}

function meetsTrailingStop(order: ClassicOrder, action: TradeAction, position: Position): boolean{
    const relativePrice = action === TradeAction.BUY 
        ? position.relativeLow 
        : position.relativeHigh; 

    const percentChange = (Math.abs(relativePrice - position.currentSharePrice)) / relativePrice;

    return percentChange > order.amount;
}