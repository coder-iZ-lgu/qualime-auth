
const openConnection = async (db) => {
    await db.authenticate();
    return db.sync({ after: true });
}

const closeConnection = async (db) => {
    return db.close();
}

module.exports = {openConnection, closeConnection}