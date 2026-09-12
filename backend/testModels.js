import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(
    ''
);

async function checkModels(){

    const models = await genAI.listModels();

    for(const model of models){
        console.log(model.name);
    }
}

checkModels();

