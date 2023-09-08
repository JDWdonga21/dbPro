"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
const uuid_1 = require("uuid");
const app = (0, express_1.default)();
const port = 3000;
const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
};
const apiAxios = axios_1.default.create({
    //이것이 작동한 이유?
    baseURL: 'http://127.0.0.1:3000',
    //baseURL: 'http://127.0.0.1:3001',
    timeout: 3000,
});
const arrayOfElements = Array.from({ length: 100 }, () => ({
    uuid: (0, uuid_1.v4)(),
    checked: false,
}));
console.log(arrayOfElements);
app.use(express_1.default.json());
// app.use(bodyParser.urlencoded())
app.get('/all', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const axiosResponse = yield axios_1.default.get('http://127.0.0.1:5001/get_uuids');
        const uuidsInDb = axiosResponse.data.uuids;
        let trueCount = 0;
        let falseCount = 0;
        uuidsInDb.forEach((dbElement) => {
            const foundElement = arrayOfElements.find(element => element.uuid === dbElement.uuid);
            if (foundElement) {
                foundElement.checked = true;
                trueCount++;
            }
            else {
                falseCount++;
            }
        });
        res.json({
            arrayOfElements,
            trueCount,
            falseCount
        });
    }
    catch (error) {
        res.status(500).json({ message: 'An error occurred while making the GET request.', error });
    }
}));
app.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let trueCount = 0;
        let falseCount = 0;
        // Using an async function with a for loop to introduce delay
        for (let i = 0; i < arrayOfElements.length; i++) {
            const element = arrayOfElements[i];
            try {
                const axiosResponse = yield axios_1.default.get(`http://127.0.0.1:5001/${element.uuid}`);
                console.log(`UUID ${element.uuid} found on server`);
                if (axiosResponse.data.uuid) {
                    element.checked = true;
                    trueCount++;
                }
            }
            catch (error) {
                const axiosError = error;
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
    }
    catch (error) {
        res.status(500).json({ message: 'An error occurred while making the GET request.', error });
    }
}));
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
app.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Send POST request to Python server to update the database
        yield axios_1.default.post('http://127.0.0.1:5001/update_uuids', { data: arrayOfElements });
        res.json({ message: 'Successfully updated the Python server.' });
    }
    catch (error) {
        res.status(500).json({ message: 'An error occurred while making the POST request.', error });
    }
}));
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
exports.default = apiAxios;
