// backend/memoryAgent.js
export const memoryAgent = {
  lastQuery: null,
  schema: {},

  setLastQuery(query) {
    this.lastQuery = query;
  },

  getLastQuery() {
    return this.lastQuery;
  },

  updateSchema(tableName, columns) {
    this.schema[tableName] = columns;
  },

  getSchema(tableName) {
    return this.schema[tableName] || null;
  },
};
