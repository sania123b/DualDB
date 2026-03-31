// Agent 1: Interprets user query into SQL
export const interpretQuery = (userInput) => {
  let sql = "";

  if (userInput.includes("orders above")) {
    const amount = userInput.match(/\d+/)?.[0];
    sql = `SELECT * FROM orders WHERE amount > ${amount};`;
  } else if (userInput.includes("customers")) {
    sql = "SELECT name, email FROM customers;";
  } else {
    sql = "SELECT * FROM orders;";
  }

  return { interpretedSQL: sql };
};
