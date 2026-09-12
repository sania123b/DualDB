import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(
    'AIzaSyBzjfN-P8A2f046wGn-WPpUHIA4BGeUlXE'
);

async function checkModels(){

    const models = await genAI.listModels();

    for(const model of models){
        console.log(model.name);
    }
}

checkModels();

