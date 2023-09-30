
const { User, Role, Teacher, Token } = require("../../../db/models");

const ApiError = require("../../../helpers/errors")
const { checkToken } = require("../../../helpers/token")
const { createTokens } = require("../helpers/token")
const { getHMACHash } = require("../helpers/getHMACHash")
const { usernameValidateForRegister, passwordValidateForRegister, usernameValidateForLogin, passwordValidateForLogin } = require("../helpers/validation")

class AuthController {
  async signup(req, res) {
    try {
      const { email, username, password, passwordConfirmation, name, school } = req.body
      const roles = ["login", "teacher"]
      const { result: usernameRes, error: usernameError } = await usernameValidateForRegister(username)

      if (!usernameRes) {
        return ApiError.badRequest(res, usernameError)
      }


      const { result: passwordRes, error: passwordError } = passwordValidateForRegister(password, passwordConfirmation)

      if (!passwordRes) {
        return ApiError.badRequest(res, passwordError)
      }


      const hash = getHMACHash(password)
      const user = new User({
        email,
        username,
        password: hash,
        logins: 0,
        last_login: "",
        verification: 0,
        name,
      })
      await user.save()

      await Promise.all(roles.map(async (roleName) => {
        const role = await Role.findOne({ where: { name: roleName } })
        await user.addRole(role)
      }));

      await user.setTeacher(new Teacher({
        user_id: user.id,
        school
      }))

      const newUser = await User.findByPk(user.id,
        {
          include: [
            {
              model: Role,
              through: { attributes: [] }
            }
          ]
        })

      const userRoles = newUser.roles

      const payload = {
        id: user.id,
        roles: userRoles
      }

      const tokens = createTokens(payload)
      const refreshToken = tokens[1].refreshToken

      await user.setToken(new Token({
        user_id: user.id,
        refresh_token: refreshToken
      }))

      const result = {
        statusCode: 200,
        message: "Аккаунт успешно зарегистрирован",
        tokens
      }

      return res.json(result)

    } catch (err) {
      console.log(err)
      return ApiError.internalServerError(res, "Внутренняя ошибка сервера")
    }
  }

  async signin(req, res) {
    try {
      const { username, password } = req.body
      const { result: usernameRes, error: usernameError } = await usernameValidateForLogin(username)

      if (!usernameRes) {
        return ApiError.badRequest(res, usernameError)
      }

      const user = usernameRes
      const userPasswordHash = user.password
      const { result: passwordRes, error: passwordError } = passwordValidateForLogin(password, userPasswordHash)

      if (!passwordRes) {
        return ApiError.badRequest(res, passwordError)
      }


      const logins = Number(user.logins) + 1
      const currentDate = Date.now()

      await user.update({ logins, last_login: currentDate })

      const newUser = await User.findByPk(user.id,
        {
          include: [
            {
              model: Role,
              through: { attributes: [] }
            }
          ]
        })

      const userRoles = newUser.roles

      const payload = {
        id: user.id,
        roles: userRoles
      }

      const tokens = createTokens(payload)
      const refreshToken = tokens[1].refreshToken
      const updatedToken = await user.token.set({ user_id: user.id, refresh_token: refreshToken })
      await updatedToken.save()

      const result = { statusCode: 200, message: "Вход выполнен", tokens }

      return res.json(result)

    } catch (err) {
      console.log(err)
      return ApiError.internalServerError(res, "Внутренняя ошибка сервера")
    }
  }

  async logout(req, res) {
    try {
      const accessToken = req.headers["x-access-token"]
      const userData = checkToken(accessToken, "access")

      if (!userData) {
        return ApiError.Unauthorized(res, "Некорректный токен доступа")
      }

      const user = await User.findByPk(userData.id, {
        include: Token
      })

      const updatedToken = await user.token.set({ user_id: user.id, refresh_token: "" })
      await updatedToken.save()

      const result = {
        statusCode: 200,
        message: "Refresh-токен успешно очищен"
      }

      return res.json(result)

    } catch (err) {
      console.log(err)
      return ApiError.internalServerError(res, "Внутренняя ошибка сервера")
    }
  }

  async refreshToken(req, res) {
    const refreshToken = req.headers["x-refresh-token"]
    const userData = checkToken(refreshToken, "refresh")

    if (!userData) {
      return ApiError.badRequest(res, "Некорректный токен")
    }

    const user = await User.findByPk(userData.id, {
      include: [{ model: Token }, { model: Role }]
    })

    const userRoles = user.roles

    const payload = {
      id: user.id,
      roles: userRoles
    }

    const tokens = createTokens(payload)
    const updatedRefreshToken = tokens[1].refreshToken
    const updatedToken = await user.token.set({ user_id: user.id, refresh_token: updatedRefreshToken })
    await updatedToken.save()

    const result = { statusCode: 200, message: "Токены успешно пересозданы", tokens }

    return res.json(result)
  }

  async check(req, res) {
    try {
      const accessToken = req.headers["x-access-token"]
      const userData = checkToken(accessToken, "access")

      if (!userData) {
        return ApiError.Unauthorized(res, "Некорректный токен доступа")
      }

      const result = {
        statusCode: 200,
        ...userData
      }

      return res.json(result)

    } catch (err) {
      console.log(err)
      return ApiError.internalServerError(res, "Внутренняя ошибка сервера")
    }
  }
}

module.exports = new AuthController();