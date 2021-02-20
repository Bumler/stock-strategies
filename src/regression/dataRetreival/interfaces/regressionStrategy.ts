interface RegressionStrategy {
    conditions: ConditionalTrade[];
}

interface ConditionalTrade {
    order: Order;
    action: TradeAction;
    sharesToTrade: number;
}

interface Order {
    amount: number;
    tradeCondition: ClassicOrder;
}

enum ClassicOrder {
    TRAILING_STOP
}

enum TradeAction {
    BUY, SELL
}

export { RegressionStrategy, ConditionalTrade, TradeAction, ClassicOrder };