import "babel-polyfill"
import axios from 'axios'

class EksiClient {

	/**
     * ##
     * @param {Object} options - ##
	 * @param {string} version - ##
     */
	constructor({uri, client_secret}, version = null){
		this.uri = uri || ""
		this.client_secret = client_secret || ""
		this.client_version = version || 'v1/'

		this.client = axios.create({
			baseURL: this.uri,
			headers: {
				'user-agent': null
			}
		})
	}

	/**
     * ##
     * @param {Object} env - ##
     */
	define(env){
		this.client = axios.create({
			baseURL: this.uri,
			headers: {
				'authorization': `bearer ${env.access_token}`,
				'user-agent': null
			}
		})

		this.client.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
		this.env = env
	}

	 /**
     * ##
	 * @async
     * @param {Object} params - ##
     * @return {Promise} ##
     */
	async getAccessToken(params = {}){
		return await this.client.post(`token`, Object.assign(params, {
			client_secret: this.client_secret,
			grant_type: 'password'
		}))
	}

	/**
     * ##
	 * @async
     * @param {Object} params - ##
     * @return {Promise} ##
     */
	async getMe(params = {}){
		return await this.client.get(`${this.client_version}/user/${this.env.nick}`, { params })
	}

	/**
	 * @todo Write the documentation.
	 * @todo Implement this function.
	 */
	async setRefreshAccessToken(){

	}
}

export default EksiClient