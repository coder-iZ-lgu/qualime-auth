const Router = require("express");
const router = new Router();

const authRouter = require("./modules/auth/router");

router.use("/auth", authRouter);

module.exports = router;