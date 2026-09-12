import { ChromaClient } from "chromadb";

const client = new ChromaClient({
    host: "localhost",
    port: 8000
});


export async function getCollection(){

    const collection = await client.getOrCreateCollection({
        name:"database_schema",
        embeddingFunction: null
    });

    return collection;
}