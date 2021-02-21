import express, { Request, Response } from 'express';
import moment from 'moment';
import AlphaVantageClient from '../regression/dataRetreival/alphaVantage/alphaVantageClient';
import MarketDataRetreiver from '../regression/dataRetreival/marketDataRetriever';

class RegressionController {
    public path = '/regression';
    public router = express.Router();
    marketDataRetriever: MarketDataRetreiver; 
   
    constructor() {
        this.marketDataRetriever = new MarketDataRetreiver(new AlphaVantageClient())
      this.intializeRoutes();
    }
   
    intializeRoutes = () => {
      this.router.get(`${this.path}/run`, this.runRegression);
    }
   
    runRegression = async (req: Request, res: Response) => {
        //will ultimately pass in a strategy
        console.log("Running Regression");
        res.send(await this.marketDataRetriever.getMarketDataFile("GME", moment("2019-12-05 20:00:00")));
    };
  }
   
  export default RegressionController;