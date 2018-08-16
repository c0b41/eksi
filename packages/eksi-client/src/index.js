import axios from 'axios'

export default class EksiClient {

	constructor({uri, client_secret}, version = null){
		this.uri = uri || ""
		this.client_secret = client_secret || ""
		this.client_version = version || 'v1/'

		this.client = axios.create({
			baseUrl: this.uri,
			headers: {
				'user-agent': null
			}
		})


	}

	define(env){
		this.client = axios.create({
			baseUrl: this.uri,
			headers: {
				'authorization': `bearer ${env.access_token}`,
				'user-agent': null
			}
		})

		this.client.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
		this.env = env
	}

	async getAccesToken(params = {}){
		return await this.client.post(`token`, Object.assign(params, {
			client_secret: this.client_secret,
			grant_type: 'password'
		}))
	}

	async getMe(params = {}){
		return await this.client.get(`${this.client_version}/user/${this.env.nick}`, { params })
	}

}