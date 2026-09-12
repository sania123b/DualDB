export function createSchemaDocuments(rows) {

    const tables = {};

    for (const row of rows) {

        const tableName = row[0];
        const columnName = row[1];
        const dataType = row[2];


        // ignore Oracle recycle bin tables
        if(tableName.startsWith("BIN$"))
            continue;


        if(!tables[tableName]) {
            tables[tableName] = [];
        }


        tables[tableName].push(
            `${columnName} (${dataType})`
        );
    }


    const documents = [];


    for(const table in tables) {

        const document = `
Table Name: ${table}

Columns:
${tables[table].join("\n")}
        `;


        documents.push({
            table,
            text: document.trim()
        });
    }


    return documents;
}