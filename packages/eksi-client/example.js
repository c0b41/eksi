const EksiClient = require('./dist')

const eksi = new EksiClient({
	uri: 'http://localhost:9000',
	client_secret: process.env.EksiClientID
})

eksi.getAccessToken({
	username: 'xx',
	password: 'xxx'
}).then((response) => {
	console.log(response.data)
	console.log(response.status)
}).catch(err => console.error(err))
