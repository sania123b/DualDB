import { pipeline } from "@xenova/transformers";
import { getCollection } from "./chromaClient.js";
import { extractSchema } from "./schemaExtractor.js";
import { createSchemaDocuments } from "./schemaDocument.js";


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



async function storeSchemaEmbeddings(){

    const rows = await extractSchema();

    const documents = createSchemaDocuments(rows);

    const collection = await getCollection();


    for(const doc of documents){

        const embedding = await generateEmbedding(
            doc.text
        );


        await collection.add({

            ids:[doc.table],

            documents:[
                doc.text
            ],

            embeddings:[
                embedding
            ]

        });


        console.log("Stored:",doc.table);

    }


    console.log("Schema embeddings completed");

}


storeSchemaEmbeddings();