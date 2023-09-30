const { createToken } = require("../../../helpers/token")

const createTokens = (payload) => {
    const accessTokenExpirationTime = process.env.ACCESS_TOKEN_EXPIRATION_TIME
    const refreshTokenExpirationTime = process.env.REFRESH_TOKEN_EXPIRATION_TIME

    const accessToken = createToken(payload, process.env.ACCESS_TOKEN_SECRET, accessTokenExpirationTime)
    const refreshToken = createToken(payload, process.env.REFRESH_TOKEN_SECRET, refreshTokenExpirationTime)

    const result = [{ accessToken, accessTokenExpirationTime }, { refreshToken, refreshTokenExpirationTime }]

    return result
}

module.exports = { createTokens }