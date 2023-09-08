import apiAxios from "./axios/axios"
import axios, { AxiosError } from 'axios';
import { v4 as uuidv4 } from 'uuid';

// 콘솔입력 모듈
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let myElements : { uuid: string, checked: boolean }[] = [];


async function postElements() {
    let trueCount = 0;
    let falseCount = 0;
    for (const element of myElements) {
        try {
            const axiosResponse = await apiAxios.post('http://127.0.0.1:5001/${element.uuid}', { data: element })
            console.log(`POST UUID : ${element.uuid} Code : ${axiosResponse.status} `);
            trueCount++;
        } catch (error : unknown) {
            console.error('Error:', error);  // Print any errors
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
    console.log("성공률 : ", trueCount/myElements.length*100, " %")
    console.log("=========================");
    
}
async function getElements() {
    let trueCount = 0;
    let falseCount = 0;
    for (const element of myElements) {
        try {
            const axiosResponse = await apiAxios.get(`http://127.0.0.1:5001/${element.uuid}`)
            console.log(`GET UUID : ${element.uuid} Code : ${axiosResponse.status} `);
            if (axiosResponse.data.uuid === element.uuid) {
                element.checked = true;
                trueCount++;
            }else {
                element.checked = false;
                falseCount++;
            }
        } catch (error : unknown) {
            const axiosError = error as AxiosError;
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
    console.log("성공률 : ", trueCount/myElements.length*100, " %")
    console.log("=========================");
}

function getInputAndProcess() {
  rl.question("Please enter a command: ", function (input : string) {
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
            uuid: uuidv4(),
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


