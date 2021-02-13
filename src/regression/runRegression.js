// const fs = require('fs');
// const _ = require('lodash');
// const parseCSV = require('./alphaVantageDataParser').parseCSV;

// function runRegression(order, strategy){
//     const historicalData = parseCSV("./resources/gmeBaby.csv");

//     let relativeHigh = 0;
//     let relativeLow = Number.MAX_SAFE_INTEGER;
//     let current = 0;
//     let shares = 0; //if shares is 0 and all buys have happened should bail out
//     let costBasis = 0;
//     let orderHistory = [];
//     let currentRow;

//     //will need to either fully preload stock data or refresh chunks
//     _.forEachRight(historicalData, function(stockData){
//         currentRow = stockData;

//         if (order.purchaseTime === stockData.time){
//             shares += Math.trunc(order.purchasePower / stockData.close);
//             orderHistory.push({shares, price: stockData.close});
//             costBasis = getCostBasis(orderHistory);
//         }

//         if (shares !== 0){
//             relativeHigh = Math.max(stockData.high, relativeHigh);
//             relativeLow = Math.min(stockData.low, relativeLow);
            
//             current = stockData.close;
            
//             let percentChangeFromRelativeHigh = (relativeHigh - stockData.low) / relativeHigh;
    
//             if (percentChangeFromRelativeHigh > strategy.trailingStopOrder){
//                 return false;
//             }
//         }
//     });

//     let profit = (current - costBasis) * shares; 

//     console.log(currentRow);
//     console.log(`Highest it got ${relativeHigh}`);
//     console.log(`Got in at ${costBasis}`);
//     console.log(`Got out at ${current}`);
//     console.log(`Profit: ${profit}`);

//     return profit;
// }

// function getCostBasis(orderHistory){
//     let totalCost = 0;
//     let totalShares = 0;

//     _.forEach(orderHistory, function(order){
//         totalCost += order.price * order.shares;
//         totalShares = order.shares;
//     });

//     return totalCost / totalShares;
// }

// function getHighestTrailingValue(){
//     let i = .01;
//     let bestTrailPadding = i;
//     let bestProfit = runRegression({purchaseTime: "2021-01-25 06:00:00", purchasePower: 14300}, {trailingStopOrder: i});

//     while(i < 1){
//         const currentProfit = runRegression({purchaseTime: "2021-01-25 06:00:00", purchasePower: 14300}, {trailingStopOrder: i});

//         if (currentProfit > bestProfit){
//             bestProfit = currentProfit;
//             bestTrailPadding = i;
//         }

//         i += .01;
//     }

//     console.log(`The best trailing amount was ${bestTrailPadding}`);
//     console.log(`With a profit of ${bestProfit}`);
// }

// //getHighestTrailingValue();
// //runRegression({purchaseTime: "2021-01-25 06:00:00", purchasePower: 14300}, {trailingStopOrder: .25});