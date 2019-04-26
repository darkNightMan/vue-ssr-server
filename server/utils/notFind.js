module.exports = (req, res, next) => {
  const errorRes = '404'
  res.sendErr(errorRes)
}