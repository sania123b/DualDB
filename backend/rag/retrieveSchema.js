import { pipeline } from "@xenova/transformers";
import { getCollection } from "./chromaClient.js";


let embedder;


async function generateEmbedding(text){

    if(!embedder){
        embedder = await pipeline(
            "feature-extraction",
            "Xenova/all-MiniLM-L6-v2"
        );
    }


    const output = await embedder(
        text,
        {
            pooling:"mean",
            normalize:true
        }
    );


    return Array.from(output.data);
}



export async function retrieveSchema(query){

    const collection = await getCollection();


    const queryEmbedding = await generateEmbedding(query);


    const result = await collection.query({

        queryEmbeddings:[
            queryEmbedding
        ],

        nResults:3,

    });


    return result.documents[0];

}