const low = require("lowdb");
const fsAsync = require("lowdb/adapters/FileAsync")

/**
 * @type {low.Low}
 */
let db;
let defaults = {
    images: [],
}
const createConnection = async() => {
    let adapter = new fsAsync("db.json");
    db = await low(adapter);
    db.defaults(defaults).write()
}

module.exports = {
    createConnection,
    getDatabase: () => db
}