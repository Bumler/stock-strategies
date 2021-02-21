import moment from "moment";
import { InitialPurchaseOrder } from "./tradeExecution/initialPurchaseOrder";

export class InitialPurchases {
    initialPurchases: Map<string, InitialPurchaseOrder>;

    constructor(){
        this.initialPurchases = new Map<string, InitialPurchaseOrder>();
        
        this.initialPurchases.set("GME", {
            capital: 1000,
            time: moment("2019-12-05 20:00:00")
        });
    }
}