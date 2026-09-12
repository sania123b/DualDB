import { retrieveSchema } from "./rag/retrieveSchema.js";


const result = await retrieveSchema(
    "show all students"
);


console.log(result);