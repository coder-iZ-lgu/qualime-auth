const {
  createHmac,
} = require('node:crypto');


const getHMACHash = (password) => {
  const hmac = createHmac(process.env.HASH_METHOD, process.env.SECRET_KEY,);
  hmac.update(password);

  return hmac.digest('hex')
}

module.exports = { getHMACHash }
