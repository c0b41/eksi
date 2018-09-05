const EksiClient = require('./dist')

const eksi = new EksiClient({
	uri: 'http://localhost:9000',
	client_secret: 'xxxx'
})


eksi.getAccessToken({
	username: 'xx',
	password: 'xxx'
}).then((response) => {
	console.log(response.data)
	console.log(response.status)
}).catch(err => console.log(err))
