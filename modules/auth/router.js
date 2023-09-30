const Router = require("express");
const router = new Router();

const AuthorizationController = require("./controllers/authController");

router.post("/signup", AuthorizationController.signup);
router.post("/signin", AuthorizationController.signin);
router.get("/logout", AuthorizationController.logout);
router.get("/check", AuthorizationController.check);
router.get("/refresh-token", AuthorizationController.refreshToken);

module.exports = router;