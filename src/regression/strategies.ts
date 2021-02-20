/*
    This is currently a dumping ground for strategies under test
    Eventually they will be persisted but this shortcuts having to 
    deal with parsing and persisting.
*/

import { RegressionStrategy, TradeAction, ClassicOrder } from "./dataRetreival/interfaces/regressionStrategy"

class Strategies{
    public strategies: RegressionStrategy[] = [{
        conditions: [
            {
                order : {
                    amount : 25,
                    tradeCondition : ClassicOrder.TRAILING_STOP
                },
                action : TradeAction.SELL,
                sharesToTrade : 100
            }
        ]
    }];
}

export default Strategies