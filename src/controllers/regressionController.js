const app = require('express').Router();
const { getMarketDataFile } = require('../regression/marketDataRetriever.js');

app.get('/', async (req, res) => {
    //will ultimately pass in a strategy
    console.log("Running Regression");
    res.send(await getMarketDataFile("BB", "2019-12-05 20:00:00"));
});

module.exports = app;
