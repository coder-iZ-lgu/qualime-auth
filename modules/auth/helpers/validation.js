const { User, Token } = require("../../../db/models")
const { getHMACHash } = require("../helpers/getHMACHash")

const usernameValidateForRegister = async (username) => {
    if (!username && username.length < 2) {
        return { result: false, error: "Имя должно быть не менее 2 символов" }
    }

    const user = await User.findOne({
        where: {
            username
        }
    })

    if (user) {
        return { result: false, error: "Пользователь с данным именем уже есть" }
    }


    return { result: true, error: "" }
}

const passwordValidateForRegister = (password, passwordConfirmation) => {
    if (!password || password.length < 4) {
        return { result: false, error: "Пароль должен содержать не менее 4 символов" }
    }

    else if (password != passwordConfirmation) {
        return { result: false, error: "Пароли не совпадают" }
    }


    return { result: true, error: "" }
}

const usernameValidateForLogin = async (username) => {
    if (!username && username.length < 2) {
        return { result: false, error: "Имя должно быть не менее 2 символов" }
    }

    const user = await User.findOne({
        where: {
            username
        },
        include: Token
    })

    if (!user) {
        return { result: false, error: "Не удается найти пользователя с таким именем" }
    }


    return { result: user, error: "" }
}

const passwordValidateForLogin = (password, userPasswordHash) => {
    if (!password || password.length < 4) {
        return { result: false, error: "Пароль должен содержать не менее 4 символов" }
    }

    const hash = getHMACHash(password)

    if (hash != userPasswordHash) {
        return { result: false, error: "Пароли не совпадают" }
    }

    return { result: true, error: "" }
}

module.exports = { usernameValidateForRegister, passwordValidateForRegister, usernameValidateForLogin, passwordValidateForLogin }