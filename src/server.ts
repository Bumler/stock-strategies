import App from './app';
import RegressionController from './controllers/regressionController';
 
const app = new App(
  [
    new RegressionController(),
  ],
  3001,
);
 
app.listen();