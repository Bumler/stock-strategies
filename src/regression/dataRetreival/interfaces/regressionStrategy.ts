interface SaleStrategy {
    relativeTo: RelativeTo;
    action: TradeAction;
    shares: number;
    quantityType: TradeQuantityType;
}

enum RelativeTo {
    START, RELATIVE_HIGH, RELATIVE_LOW
}

enum TradeAction {
    BUY, SELL
}

enum TradeQuantityType {
    SHARE, PERCENT
}

export { SaleStrategy, RelativeTo, TradeAction, TradeQuantityType };