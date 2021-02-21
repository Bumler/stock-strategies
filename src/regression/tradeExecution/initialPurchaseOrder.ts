/*
    When we run a regression we'll take in a list of initial purchase orders.
    These orders will determine when we start running the regression for a given 
    symbol. All Stocks - at least to start - will run all available strategies.
*/

import { Moment } from "moment";

export interface InitialPurchaseOrder{
    capital: number;
    time: Moment;
}