import express from 'express';
import bodyParser from 'body-parser';
const app = express();
const port = 3000;


app.use(express.json());
app.use(bodyParser.urlencoded())
app.get('/', (req, res) => {
  res.send('Hello, GET request!');
});

app.post('/', (req, res) => {
  const body = req.body;
//   console.log(req);
  res.json({ message: 'Hello, POST request!', body });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
