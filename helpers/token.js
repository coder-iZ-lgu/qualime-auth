const jwt = require("jsonwebtoken");

const createToken = (payload, secret, expirationTime) => {
    const token = jwt.sign(payload, secret, { expiresIn: expirationTime });
    return token
}

const checkToken = (token, tokenType) => {
    try {
        let userData = {}
        const secret = tokenType === "access" ? process.env.ACCESS_TOKEN_SECRET : process.env.REFRESH_TOKEN_SECRET
        
        jwt.verify(token, secret, (err, decoded) => {
            if (err) {
                userData = null
                return
            }

            userData = decoded
        });

        return userData
    } catch (err) {
        console.log(err)
    }
}

module.exports = {
    createToken, checkToken
}