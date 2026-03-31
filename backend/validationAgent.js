// backend/validationAgent.js

/**
 * Checks the SQL query for high-risk DDL/DML commands.
 *
 * @param {string} sql The generated SQL query string.
 * @returns {{isSafe: boolean, commandType: string}}
 */
export function validationAgent(sql) {
    const riskKeywords = ["CREATE", "DROP", "ALTER", "TRUNCATE", "DELETE", "UPDATE"];
    const normalizedSql = sql.trim().toUpperCase();

    // Determine the command type (for logging/display)
    const commandMatch = normalizedSql.match(/^(\w+)/);
    const commandType = commandMatch ? commandMatch[1] : 'UNKNOWN';

    // Check if the query starts with any of the high-risk keywords
    const isHighRisk = riskKeywords.some(keyword => normalizedSql.startsWith(keyword));

    return {
        isSafe: !isHighRisk,
        commandType: commandType,
        sql: sql // Return original SQL for clarity
    };
}