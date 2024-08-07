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

connectToDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});
