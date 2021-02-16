import fs from 'fs';
import _ from 'lodash';
import moment from 'moment';
import DataClient from './interfaces/dataClient';
import { MarketDataFile }  from './interfaces/marketDataDirectory';
import parseMarketData from './marketParsingFactory';
import ParsedMarketData from './interfaces/parsedMarketData';

class MarketDataRetreiver {
    MARKET_DATA_DIRECTORY_PATH = './resources/marketDataFileDirectory.json';
    client: DataClient;

    constructor(client: DataClient){
        this.client = client;
    }

    //todo validation on date should be < 24 months and not after today.
    public getMarketData = async (symbol: string, date: string): Promise<ParsedMarketData[]> => {
        console.log("starting");
        const marketDataDirectory = this.getMarketDataDirectory();

        const fileInfoForDate = (marketDataDirectory?.get(symbol.toUpperCase()) || [])
            .find(data => moment(date).isBetween(moment(data.startDate), moment(data.endDate)));
    
        if (fileInfoForDate){
            console.log(`Already have market data for ${symbol} during ${date}`)
            const rawData: string = fs.readFileSync(this.createPath(fileInfoForDate.fileName), 'utf-8');
            return parseMarketData(rawData, this.client.source);
        }
        
        const retrievedData = await this.client.retrieveDataForDate(symbol, date);
    
        const fileName = this.writeMarketDataToFile(symbol, date, retrievedData);
        const parsedData = parseMarketData(retrievedData, this.client.source);
        this.updateDataFileDirectory(marketDataDirectory, symbol, fileName, parsedData);
        
        return parsedData;
    }
    
    getMarketDataDirectory = (): Map<string, MarketDataFile[]> => {
        try {
            const marketDataLocations: Map<string, MarketDataFile[]> 
                = new Map (JSON.parse(fs.readFileSync(this.MARKET_DATA_DIRECTORY_PATH, 'utf-8')));            

            return marketDataLocations;
        } catch(err: any){
            //this could be moved to a startup activity.
            console.log("No market data directory found. Creating a new one.");
            return new Map<string, MarketDataFile[]>();
        }
    }

    createPath = (fileName: string): string => {
        return `./resources/${fileName}`;
    }
    
    writeMarketDataToFile(symbol: string, date: string, retrievedData: string) {
        const fileName = `${symbol}/${symbol}-${date.replace(/:/g, "-")}.csv`;
    
        this.ensureDirectoryExistence(this.createPath(symbol));
    
        console.log(`Writing market data to ${fileName}`);
        //this may cause an issue if we query for the same date while querying a symbol
        fs.writeFile(this.createPath(fileName), retrievedData, err => this.writeCallback(err));
        return fileName;
    }
    
    ensureDirectoryExistence(dirPath: string) {
        if (fs.existsSync(dirPath)) {
          return true;
        }
    
        console.log(`Creating directory ${dirPath}`);
        fs.mkdirSync(dirPath);
      }
    
    updateDataFileDirectory(marketDataDirectory: Map<String, MarketDataFile[]>, symbol: string, fileName: string, parsedData: ParsedMarketData[]){
        let marketDataForSymbol = marketDataDirectory.get(symbol.toUpperCase());
    
        const endDate = _.head(parsedData)?.time;
        const startDate = _.last(parsedData)?.time;

        console.log(`First: ${_.head(parsedData)}`);
        console.log(`Last: ${_.last(parsedData)}`);

        if (!endDate || !startDate){
            throw new Error("Error retreiving start or end date");
        }

        const newFileInfo = {
            source: this.client.source,
            fileName,
            startDate, endDate
        };

        console.log(`Adding new market data to directory\n${JSON.stringify(newFileInfo)}`);
    
        if (!marketDataForSymbol || _.isEmpty(marketDataForSymbol)){
            marketDataDirectory.set(symbol.toUpperCase(), [newFileInfo]);
        }
        else {
            marketDataForSymbol.push(newFileInfo);
        }
    
        const asJson = JSON.stringify(Array.from(marketDataDirectory.entries()));
        fs.writeFile(this.MARKET_DATA_DIRECTORY_PATH, asJson, err => this.writeCallback(err));
    }
    
    writeCallback = (err: NodeJS.ErrnoException | null) => {
        if( err )
            console.error(err);
    }
}

export default MarketDataRetreiver;