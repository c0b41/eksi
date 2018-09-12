import "babel-polyfill"
import axios from 'axios'
import queryString from 'query-string'

/**
* Modül ve methodlar zaman içerisinde değişebilir
* Eksik birçok method bulunmakta
* @author c0b41 <cobaimelan@protonmail.ch>
* @copyright c0b41 2018 MIT
*/
class EksiClient {

	/**
     * @param options {Object}
	 * @param options.uri {String} api urlesi 
	 * @param options.client_secret {String} api client_secret id'si
	 * @param version {string} api servisi sürümü
     */
	constructor({uri, client_secret}, version = null){
		this.uri = uri || ""
		this.client_secret = client_secret || ""
		this.client_version = version || 'v1'

		this.client = axios.create({
			baseURL: this.uri
		})

	}

	/**
     * Api servisine istek atabilmek için kullanıcı verileri set etmeye yarıyor
     * @param env  {Object}
	 * @param env.access_token {String}
	 * @param env.nick {String}
	 * @param env.user_id {Number}
	 * @return {Void}
     */
	define(env){
		this.client = axios.create({
			baseURL: this.uri,
			headers: {
				'authorization': `bearer ${env.access_token}`,
			}
		})

		this.env = env
	}

	 /**
     * Api servisi üzerinden access token almak için kullanılıyor
	 * @async
     * @param params {Object}
	 * @param params.username {String}
	 * @param params.password {String}
     * @return {Promise}
     */
	async getAccessToken(params = {}){
		return await this.client.post(`token`, 
			queryString.stringify(Object.assign({
				grant_type: 'password',
				client_secret: this.client_secret
			}, params)))

			// Todo: axios https://github.com/axios/axios/issues/362
	}

	/**
     * Kendi kullanıcınıza ait verilere ulaşmak için
	 * @async
     * @param params {Object}
     * @return {Promise}
     */
	async getMe(params = {}){
		return await this.client.get(`${this.client_version}/user/${this.env.nick}`, { params })
	}

	/**
	 * Ekşi sözlük apisinde tokeninizi yenilemek için henüz bir route yok
	 * tokeninizi yenilemek isterseniz @getAccessToken methodunu kullanmanız gerek
	 * @todo not working.
	 */
	async setRefreshAccessToken(){

	}

	/**
     * Kendinize ait entryleri erişmek için
	 * @async
     * @param params {Object}
	 * @param params.p {Number} Sayfa sayısı
     * @return {Promise}
     */
	async getMyEntrys(params = { p: 1 }) {
		return await this.client.get(`${this.client_version}/user/${this.env.nick}/entries`, { params })
	}

	/**
     * Kendinize ait favorileri erişmek için
	 * @async
     * @param params {Object}
	 * @param params.p {Number} Sayfa sayısı
     * @return {Promise}
     */
	async getMyFavorites(params = { p: 1 }) {
		return await this.client.get(`${this.client_version}/user/${this.env.nick}/favorites`, { params })
	}


	/**
     * Kendinize ait mesajlara erişmek için
	 * @async
     * @param params {Object}
	 * @param params.p {Number} Sayfa sayısı
     * @return {Promise}
     */
	async getMyMessages(params = { p: 1 }) {
		return await this.client.get(`${this.client_version}/message`, { params })
	}

	/**
     * Konuya bugün girilen entrylere erişmek için
	 * @async
     * @param params {Object}
	 * @param params.p {Number} Sayfa sayısı
     * @return {Promise}
	 * @todo not working
     */
	async getTopicEntrysToday(topic_id, params = { p: 1 }) {
		return await this.client.get(`${this.client_version}/topic/${topic_id}/today`, { params })
	}

	/**
     * Konuya girilen entrylere erişmek için
	 * @async
     * @param params {Object}
	 * @param params.p {Number} Sayfa sayısı
	 * @param params.day {String} Tarih
     * @return {Promise}
	 * @todo not working
     */
	async getTopicEntrys(topic_id, params = { p: 1 }) {
		return await this.client.get(`${this.client_version}/topic/${topic_id}`, { params })
	}

	/**
     * Bugün girilen konular
	 * @async
     * @param params {Object}
	 * @param params.p {Number} Sayfa sayısı
     * @return {Promise}
     */
	async getTodayTopics(params = { p: 1}){
		return await this.client.get(`${this.client_version}/index/today`, { params })
	}

	/**
     * Bugün girilen popüler konular
	 * @async
     * @param params {Object}
	 * @param params.p {Number} Sayfa sayısı
     * @return {Promise}
     */
	async getPopularTopics(params = { p: 1 }) {
		return await this.client.get(`${this.client_version}/index/popular`, { params })
	}

	/**
     * Takip ettiğiniz yazarların entry girdiği konular
	 * @async
     * @param params {Object}
	 * @param params.p {Number} Sayfa sayısı
     * @return {Promise}
     */
	async getMyBuddysTopics(params = { p: 1 }) {
		return await this.client.get(`${this.client_version}/index/feed/entry`, { params })
	}

	/**
     * Takip ettiğiniz yazarların favorilediği entryler
	 * @async
     * @param {Object} params - ##
     * @return {Promise}
     */
	async getMyBuddysFavorites(params = { p: 1 }) {
		return await this.client.get(`${this.client_version}/index/feed/favorites`, { params })
	}

	/**
     * Ekşi sözlük konu başlıkları
	 * @async
     * @param {Object} params - ##
     * @return {Promise} 
     */
	async getChannels(params = {}) {
		return await this.client.get(`${this.client_version}/channel/list`, { params })
	}

	/**
     * Ekşi sözlük başlıklara ait entryler için
	 * @async
     * @param {Object} params - ##
     * @return {Promise} 
     */
	async getChannel(name, params = { p: 1 }) {
		return await this.client.get(`${this.client_version}/index/channel/${name}`, { params })
	}

	/**
     * 
	 * @async
     * @param query {String}  Aranan kelime
     * @return {Promise} 
     */
	async getAutoCompletes(query) {
		return await this.client.get(`${this.client_version}/autocomplete/query/${query}`)
	}

	/**
     * 
	 * @async
     * @param params {Object}
	 * @param params.term {String} Aranan kelime
     * @return {Promise} 
	 * @todo not working
     */
	async setSearch(params = { term : null}) {
		return await this.client.get(`${this.client_version}/topic/query`, { params })
	}
}

export default EksiClient