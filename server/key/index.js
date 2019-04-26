const fs = require('fs')
const privateKey  = fs.readFileSync('private.pem', 'utf8')
const certificate = fs.readFileSync('file.crt', 'utf8')

module.exports = { privateKey, certificate }