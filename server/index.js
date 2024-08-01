const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const router = require('./router.js');
const connectToDatabase = require('./models/index.js');

const app = express();

// middlewares
app.use(cors()); // cross origin resource sharing to allow requests from the client
app.use(bodyParser.json()); // parsing the data from the client
app.use(router); // using the router

const PORT = 3000;
const LOCAL_IP_ADRESS = '192.168.1.103';

// connecting to the db and running the server

connectToDatabase().then(() => {
  app.listen(PORT, LOCAL_IP_ADRESS, () => {
    console.log(`Server is running on http://${LOCAL_IP_ADRESS}:${PORT}`);
  });
});
