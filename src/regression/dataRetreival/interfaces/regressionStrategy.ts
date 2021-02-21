interface RegressionStrategy {
    conditions: ConditionalTrade[];
}

/*
    A conditional trade has a classic order an action and a number of
    shares to trade (percentage based). Currently only ClassicOrders are 
    supported but this could grow to handle different orders such by extending 
    the allowed types
    The conditional trade executor has a factory that marries any Order 
    type with logic to determine if it is actionable.
*/
interface ConditionalTrade {
    order: SupportedOrder;
    action: TradeAction;
    sharesToTrade: number;
}

interface SupportedOrder {
    type: SupportedOrderType;
    [others: string]: any;
}

interface ClassicOrder {
    type: SupportedOrderType.CLASSIC_ORDER
    amount: number;
    tradeCondition: ClassicOrderType;
}

enum SupportedOrderType{
    CLASSIC_ORDER
}

enum ClassicOrderType {
    TRAILING_STOP
}

enum TradeAction {
    BUY, SELL
}

export { RegressionStrategy, ConditionalTrade, TradeAction, ClassicOrder, ClassicOrderType, SupportedOrder, SupportedOrderType };