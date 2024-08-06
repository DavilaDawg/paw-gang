import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import router from './router';
import connectToDatabase from './models/index';

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(router);


const PORT = 3000;
const ip= "10.10.22.20"

connectToDatabase().then(() => {
  app.listen(PORT, ip, () => {
    console.log(`Server is running on http://${ip}:${PORT}`);
  });
});
