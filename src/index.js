const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();  
app.use(bodyParser.json());
app.use(cors());

const regressionController = require('./controllers/regressionController.js');
app.use('/regression', regressionController);

app.listen(3001, async () => {
    console.log('listening on port 3001');
});

module.exports = app;