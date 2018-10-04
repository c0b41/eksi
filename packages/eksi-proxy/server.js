const createProxy = require('micro-proxy')
const PORT = process.env.PORT || 9000

const proxy = createProxy([
    {
        "pathname": "/**",
        "method": ["GET", "POST", "OPTIONS"],
        "dest": "https://api.eksisozluk.com/",
        "beforeRequest": async (req) => {

            return req
        },
        "beforeResponse": async (res) => {

            res.setHeader("Access-Control-Allow-Origin", "*");
            res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
            res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
            res.setHeader('Access-Control-Allow-Credentials', true);

            return res
        }
    }
])

proxy.listen(PORT, (err) => {
  if (err) {
    throw err
  }
    console.log(`> Ready on http://localhost:${PORT}`)
})