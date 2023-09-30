const path = require('path');

require('dotenv').config()
const cors = require("cors")
const Express = require("express");
const db = require("./db/dbSetup")
const { openConnection, closeConnection } = require("./db/helpers/setup")

const router = require("./router");

const app = Express()

const PORT = process.env.APPLICATION_PORT;

app.use(Express.json());
app.use("/api/v1", router);

const bootstrap = async () => {
    try {
        await openConnection(db)
        app.listen(PORT, "127.0.0.1");
        console.log(app._router.stack)
    } catch (err) {
        console.error('Unable to connect to the database:', err)
    }
};

bootstrap();
