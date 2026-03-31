// databaseAgent.js
import oracledb from "oracledb";
import dotenv from "dotenv";
import { errorRecoveryAgent } from "./errorRecoveryAgent.js"; // Assuming you import this
// import { loggerAgent } from "./loggerAgent.js"; // We'll move the logging logic into the DB for better auditability

dotenv.config();

oracledb.initOracleClient({ libDir: process.env.ORACLE_CLIENT_LIB });

// Global for tracking the audit log ID during a single transaction
let currentAuditLogId = null;

// --- NEW FUNCTION: Insert Initial Log ---
async function insertInitialLog(connection, userPrompt, generatedSql) {
    const insertSql = `
        INSERT INTO AI_AUDIT_LOG (USER_PROMPT, GENERATED_SQL, EXECUTION_STATUS)
        VALUES (:userPrompt, :generatedSql, 'ATTEMPT')
        RETURNING LOG_ID INTO :logId`;
    
    // Bind variables are crucial for security and handling large CLOBs
    const result = await connection.execute(insertSql, {
        userPrompt: userPrompt,
        generatedSql: generatedSql
    }, {
        autoCommit: true,
        returning: { logId: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT } }
    });
    
    // Store the generated LOG_ID
    return result.outBinds.logId[0];
}

// --- NEW FUNCTION: Update Final Log ---
async function updateFinalLog(connection, logId, status, finalSql, errorCode, errorMessage) {
    const updateSql = `
        UPDATE AI_AUDIT_LOG
        SET EXECUTION_STATUS = :status,
            FINAL_SQL = :finalSql,
            ERROR_CODE = :errorCode,
            ERROR_MESSAGE = :errorMessage
        WHERE LOG_ID = :logId`;
        
    const binds = {
        status: status,
        finalSql: finalSql,
        errorCode: errorCode || null,
        errorMessage: errorMessage || null,
        logId: logId
    };

    await connection.execute(updateSql, binds, { autoCommit: true });
}

export async function databaseAgent(sqlQuery, userPrompt = "") {
    let connection;
    let finalResult; // To store the successful result rows

    try {
        connection = await oracledb.getConnection({ /* ... connection details ... */ });
        
        // 1. Log Initial Attempt
        currentAuditLogId = await insertInitialLog(connection, userPrompt, sqlQuery);
        console.log(`📝 Audit Log ID: ${currentAuditLogId} created.`);

        // 2. Execute SQL (with error recovery loop)
        const queries = sqlQuery.split(";").map(q => q.trim()).filter(q => q.length > 0);
        let currentQuery = sqlQuery;
        let recoveryAttempt = 0;
        
        while(recoveryAttempt < 2) { // Allow one recovery attempt (original + 1 fix)
            try {
                // Execute all statements
                for (const q of queries) {
                    console.log(`⚡ Executing SQL (Attempt ${recoveryAttempt + 1}):`, q);
                    finalResult = await connection.execute(q); // Use finalResult to hold the last execution's result
                    await connection.commit();
                }
                
                // 3. Log Success and Break Loop
                await updateFinalLog(connection, currentAuditLogId, 'SUCCESS', currentQuery, null, null);
                break; // Success, exit the loop
                
            } catch (err) {
                if (recoveryAttempt >= 1) { // Second attempt failed, final failure
                    throw err;
                }
                
                // --- Error Recovery Logic (Original Code Integration) ---
                console.error("❌ Execution Failed. Invoking Recovery Agent...");
                const originalError = err.message;
                const fixedSQL = await errorRecoveryAgent(currentQuery, originalError, userPrompt);

                if (!fixedSQL) {
                    throw err; // Recovery failed, throw original error
                }
                
                currentQuery = fixedSQL; // Update query for next loop iteration
                queries = fixedSQL.split(";").map(q => q.trim()).filter(q => q.length > 0); // Re-split fixed queries
                recoveryAttempt++;
                
                // Note: The success log will happen at the END of the next loop iteration
            }
        } // End while loop

        // 4. Return Final Result
        return finalResult;
        
    } catch (err) {
        console.error("❌ FINAL Database error:", err.message);
        
        // 5. Log Final Failure
        if (currentAuditLogId) {
            await updateFinalLog(connection, currentAuditLogId, 'FAILED', sqlQuery, err.code, err.message);
        }
        throw err;
    } finally {
        if (connection) {
            try {
                await connection.close();
                console.log("🔒 Connection closed.");
            } catch (closeErr) {
                console.error("⚠️ Error closing connection:", closeErr);
            }
        }
    }
}