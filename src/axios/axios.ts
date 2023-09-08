import express from 'express';
import bodyParser from 'body-parser';
import axios, { AxiosError } from 'axios';
import { v4 as uuidv4 } from 'uuid';


const app = express();
const port = 3000;
const sleep = (milliseconds : number) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
};

const apiAxios = axios.create({
    //이것이 작동한 이유?
    baseURL: 'http://127.0.0.1:3000',
    //baseURL: 'http://127.0.0.1:3001',
    timeout: 3000,
});


const arrayOfElements = Array.from({ length: 100 }, () => ({
  uuid: uuidv4(),
  checked: false,
}));
console.log(arrayOfElements);
app.use(express.json());
// app.use(bodyParser.urlencoded())

app.get('/all', async (req, res) => {
  try {
    const axiosResponse = await axios.get('http://127.0.0.1:5001/get_uuids');
    const uuidsInDb = axiosResponse.data.uuids;

    let trueCount = 0;
    let falseCount = 0;

    uuidsInDb.forEach((dbElement: { uuid: string }) => {
      const foundElement = arrayOfElements.find(element => element.uuid === dbElement.uuid);
      if (foundElement) {
        foundElement.checked = true;
        trueCount++; 
      }
      else{
        falseCount++;
      }
    });

    res.json({
      arrayOfElements,
      trueCount,
      falseCount
    });
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while making the GET request.', error });
  }
});

app.get('/', async (req, res) => {
  try {
    let trueCount = 0;
    let falseCount = 0;

    // Using an async function with a for loop to introduce delay
    for (let i = 0; i < arrayOfElements.length; i++) {
      const element = arrayOfElements[i];
      try {
        const axiosResponse = await axios.get(`http://127.0.0.1:5001/${element.uuid}`);
        console.log(`UUID ${element.uuid} found on server`);
        if (axiosResponse.data.uuid) {
          element.checked = true;
          trueCount++;
        }
      } catch (error: unknown) {
        const axiosError = error as AxiosError;
        if (axiosError.response && axiosError.response.status === 404) {
          console.log(`UUID ${element.uuid} not found on server`);
          element.checked = false;
          falseCount++;
        }
      }
      // Introduce delay here before making the next request
      //await new Promise(resolve => setTimeout(resolve, 5));
    }

    res.json({
      arrayOfElements,
      trueCount,
      falseCount
    });

  } catch (error) {
    res.status(500).json({ message: 'An error occurred while making the GET request.', error });
  }
});

// app.get('/:uuid', async (req, res) => {
//   try {
//     const uuid = req.params.uuid;
//     const axiosResponse = await axios.get(`http://localhost:5001/${uuid}`);
//     if (axiosResponse.data.message === 'UUID not found') {
//       res.status(404).json({ message: 'UUID not found' });
//     } else {
//       res.json(axiosResponse.data);
//     }
//   } catch (error) {
//     res.status(500).json({ message: 'An error occurred while making the GET request.', error });
//   }
// });

// app.get('/mylist', (req, res) => {
//   res.json(arrayOfElements);
// });

app.post('/', async (req, res) => {
  try {
    // Send POST request to Python server to update the database
    await axios.post('http://127.0.0.1:5001/update_uuids', { data: arrayOfElements });

    res.json({ message: 'Successfully updated the Python server.' });
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while making the POST request.', error });
  }
});

// app.post('/:uuid', async (req, res) => {
//   try {
//     const uuid = req.params.uuid;
//     const newCheckedValue = req.body.checked;
//     const element = arrayOfElements.find(e => e.uuid === uuid);

//     if (element) {
//       element.checked = newCheckedValue;
//       await axios.post(`http://localhost:5001/${uuid}`, { checked: newCheckedValue });
//       res.json({ message: 'Successfully updated the checked value for the given UUID.' });
//     } else {
//       res.status(404).json({ message: 'UUID not found.' });
//     }
//   } catch (error) {
//     res.status(500).json({ message: 'An error occurred while making the POST request.', error });
//   }
// });

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

export default apiAxios;