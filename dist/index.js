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
const axios_1 = __importDefault(require("./axios/axios"));
const uuid_1 = require("uuid");
// 콘솔입력 모듈
const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
let myElements = [];
function postElements() {
    return __awaiter(this, void 0, void 0, function* () {
        let trueCount = 0;
        let falseCount = 0;
        for (const element of myElements) {
            try {
                const axiosResponse = yield axios_1.default.post('http://127.0.0.1:5001/${element.uuid}', { data: element });
                console.log(`POST UUID : ${element.uuid} Code : ${axiosResponse.status} `);
                trueCount++;
            }
            catch (error) {
                console.error('Error:', error); // Print any errors
                falseCount++;
            }
        }
        // for (let i = 0; i < myElements.length; i++) {
        //     const element = myElements[i];
        //     try {
        //         const axiosResponse = await apiAxios.post('http://127.0.0.1:5001/${element.uuid}', { data: element })
        //         // console.log(`UUID ${element.uuid} found on server`);
        //         console.log(`POST UUID : ${element.uuid} Code : ${axiosResponse.status} `);
        //         trueCount++;
        //     } catch (error : unknown) {
        //         console.error('Error:', error);  // Print any errors
        //         falseCount++;
        //     }
        // }
        console.log(myElements);
        console.log("=========================");
        console.log("총 포스트 횟수 : ", myElements.length);
        console.log("포스트 성공  : ", trueCount);
        console.log("포스트 실패  : ", falseCount);
        console.log("성공률 : ", trueCount / myElements.length * 100, " %");
        console.log("=========================");
    });
}
function getElements() {
    return __awaiter(this, void 0, void 0, function* () {
        let trueCount = 0;
        let falseCount = 0;
        for (const element of myElements) {
            try {
                const axiosResponse = yield axios_1.default.get(`http://127.0.0.1:5001/${element.uuid}`);
                console.log(`GET UUID : ${element.uuid} Code : ${axiosResponse.status} `);
                if (axiosResponse.data.uuid === element.uuid) {
                    element.checked = true;
                    trueCount++;
                }
                else {
                    element.checked = false;
                    falseCount++;
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
        }
        // for (let i = 0; i < myElements.length; i++) {
        //     const element = myElements[i];
        //     try {
        //         const axiosResponse = await apiAxios.get(`http://127.0.0.1:5001/${element.uuid}`)
        //         console.log(`GET UUID : ${element.uuid} Code : ${axiosResponse.status} `);
        //         // console.log('Server Response:', axiosResponse.data);
        //         // console.log('Server Response:', axiosResponse.data.uuid);
        //         if (axiosResponse.data.uuid === element.uuid) {
        //             element.checked = true;
        //             trueCount++;
        //         }else {
        //             element.checked = false;
        //             falseCount++;
        //         }
        //     } catch (error : unknown) {
        //         const axiosError = error as AxiosError;
        //         if (axiosError.response && axiosError.response.status === 404) {
        //         console.log(`UUID ${element.uuid} not found on server`);
        //         element.checked = false;
        //         falseCount++;
        //         }
        //     }
        // }
        console.log(myElements);
        console.log("=========================");
        console.log("총 조회수 : ", myElements.length);
        console.log("조회 성공  : ", trueCount);
        console.log("조회 실패  : ", falseCount);
        console.log("성공률 : ", trueCount / myElements.length * 100, " %");
        console.log("=========================");
    });
}
function getInputAndProcess() {
    rl.question("Please enter a command: ", function (input) {
        // Process input here
        console.log(`You entered: ${input}`);
        if (input === "exit") {
            rl.close();
        }
        else if (input === "list") {
            console.log(myElements);
        }
        else if (input === "generate") {
            myElements = Array.from({ length: 200 }, () => ({
                uuid: (0, uuid_1.v4)(),
                checked: false,
            }));
            console.log(myElements);
        }
        else if (input === "post") {
            postElements();
        }
        else if (input === "get") {
            getElements();
        }
        else {
            console.log("잘못된 입력입니다.");
        }
        getInputAndProcess(); // Call the function recursively to get another input
    });
}
getInputAndProcess(); // Start the loop
rl.on("close", function () {
    console.log("Exiting...");
    process.exit();
});
