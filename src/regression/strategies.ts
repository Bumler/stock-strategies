/*
    This is currently a dumping ground for strategies under test
    Eventually they will be persisted but this shortcuts having to 
    deal with parsing and persisting.
*/

import { RegressionStrategy, TradeAction, ClassicOrderType, SupportedOrderType } from "./dataRetreival/interfaces/regressionStrategy"

class Strategies{
    public strategies: RegressionStrategy[] = [{
        conditions: [
            {
                order : {
                    type: SupportedOrderType.CLASSIC_ORDER,
                    tradeCondition : ClassicOrderType.TRAILING_STOP,
                    amount : .25
                },
                action : TradeAction.SELL,
                sharesToTrade : 100
            }
        ]
    }];
}

export default Strategies