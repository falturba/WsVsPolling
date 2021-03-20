const proxy = require("http-proxy-middleware")

module.exports = app => {
  app.use(proxy("/name", {target: "http://localhost:8080", ws: true}))
}