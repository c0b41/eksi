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
  constructor({ uri, client_secret }, version = null) {
    this.uri = uri || ''
    this.client_secret = client_secret || ''
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
  define(env) {
    this.client = axios.create({
      baseURL: this.uri,
      headers: {
        authorization: `bearer ${env.access_token}`
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
  async getAccessToken(params = {}) {
    return await this.client.post(
      `token`,
      queryString.stringify(
        Object.assign(
          {
            grant_type: 'password',
            client_secret: this.client_secret
          },
          params
        )
      )
    )

    // Todo: axios https://github.com/axios/axios/issues/362
  }

  /**
   * Kendi kullanıcınıza ait verilere ulaşmak için
   * @async
   * @param params {Object}
   * @return {Promise}
   */
  async getMe(params = {}) {
    return await this.client.get(
      `${this.client_version}/user/${this.env.nick}`,
      { params }
    )
  }

  /**
   * Ekşi sözlük apisinde tokeninizi yenilemek için henüz bir route yok
   * tokeninizi yenilemek isterseniz @getAccessToken methodunu kullanmanız gerek
   * @todo not working.
   */
  async setRefreshAccessToken() {}

  /**
   * Entry'e erişmek için
   * @async
   * @params entry_id {Number} Entry id
   * @param params {Object}
   * @return {Promise}
   */
  async getEntry(entry_id, params = {}) {
    return await this.client.get(`${this.client_version}/entry/${entry_id}`, {
      params
    })
  }

  /**
   * Kendinize ait entryleri erişmek için
   * @async
   * @param params {Object}
   * @param params.p {Number} Sayfa sayısı
   * @return {Promise}
   */
  async getMyEntrys(params = { p: 1 }) {
    return await this.client.get(
      `${this.client_version}/user/${this.env.nick}/entries`,
      { params }
    )
  }

  /**
   * Kendinize ait favorileri erişmek için
   * @async
   * @param params {Object}
   * @param params.p {Number} Sayfa sayısı
   * @return {Promise}
   */
  async getMyFavorites(params = { p: 1 }) {
    return await this.client.get(
      `${this.client_version}/user/${this.env.nick}/favorites`,
      { params }
    )
  }

  /**
   * Başka bir kullanıcıya ait verilere ulaşmak için
   * @async
   * @param nick {String} Kullanıcı Adı
   * @param params {Object}
   * @return {Promise}
   */
  async getUser(nick, params = {}) {
    return await this.client.get(`${this.client_version}/user/${nick}`, {
      params
    })
  }

  /**
   * Konu takip et
   * @async
   * @param topic_id {Number} Konu id
   * @param params {Object}
   * @return {Promise}
   */
  async setTopicFollow(topic_id, params = {}) {
    return await this.client.get(
      `${this.client_version}/topic/follow/${topic_id}`,
      {
        params
      }
    )
  }

  /**
   * Konu takibi bırakma
   * @async
   * @param topic_id {Number} Konu id
   * @param params {Object}
   * @return {Promise}
   */
  async setTopicUnfollow(topic_id, params = {}) {
    return await this.client.get(
      `${this.client_version}/topic/unfollow/${topic_id}`,
      {
        params
      }
    )
  }

  /**
   * Entry Upvote
   * @async
   * @param entry_id {Number} Entry id
   * @param params {Object}
   * @return {Promise}
   */
  async setEntryUpvote(entry_id, params = {}) {
    return await this.client.post(
      `${this.client_version}/entry/vote/${entry_id}/1`,
      {
        params
      }
    )
  }

  /**
   * Entry Downvote
   * @async
   * @param entry_id {Number} Entry id
   * @param params {Object}
   * @return {Promise}
   */
  async setEntryDownvote(entry_id, params = {}) {
    return await this.client.post(
      `${this.client_version}/entry/vote/${entry_id}/-1`,
      {
        params
      }
    )
  }

  /**
   * Entry Favorite
   * @async
   * @param entry_id {Number} Entry id
   * @param params {Object}
   * @return {Promise}
   */
  async setEntryFavorite(entry_id, params = {}) {
    return await this.client.post(
      `${this.client_version}/entry/${entry_id}/favorite`,
      {
        params
      }
    )
  }

  /**
   * Entry Unfavorite
   * @async
   * @param entry_id {Number} Entry id
   * @param params {Object}
   * @return {Promise}
   */
  async setEntryUnfavorite(entry_id, params = {}) {
    return await this.client.post(
      `${this.client_version}/entry/${entry_id}/unfavorite`,
      {
        params
      }
    )
  }

  /**
   * Kullanıcı engelleme
   * @async
   * @param nick {String} Kullanıcı Adı
   * @param params {Object}
   * @return {Promise}
   */
  async setUserBlock(nick, params = {}) {
    return await this.client.get(`${this.client_version}/user/${nick}/block`, {
      params
    })
  }

  /**
   * Kullanıcı engelli kaldırma
   * @async
   * @param nick {String} Kullanıcı Adı
   * @param params {Object}
   * @return {Promise}
   */
  async setUserUnblock(nick, params = {}) {
    return await this.client.get(
      `${this.client_version}/user/${nick}/unblock`,
      {
        params
      }
    )
  }

  /**
   * Kullanıcı konularını engelleme
   * @async
   * @param nick {String} Kullanıcı Adı
   * @param params {Object}
   * @return {Promise}
   */
  async setUserTopicsBlock(nick, params = {}) {
    return await this.client.get(
      `${this.client_version}/user/${nick}/indextitlesblock`,
      {
        params
      }
    )
  }

  /**
   * Kullanıcı konularını engeli kaldırma
   * @async
   * @param nick {String} Kullanıcı Adı
   * @param params {Object}
   * @return {Promise}
   */
  async setUserTopicsUnblock(nick, params = {}) {
    return await this.client.get(
      `${this.client_version}/user/${nick}/removeindextitlesblock`,
      {
        params
      }
    )
  }

  /**
   * Kullanıcı takip et
   * @async
   * @param nick {String} Kullanıcı Adı
   * @param params {Object}
   * @return {Promise}
   */
  async setUserFollow(nick, params = {}) {
    return await this.client.get(`${this.client_version}/user/${nick}/follow`, {
      params
    })
  }

  /**
   * Kullanıcı takipden çıkar
   * @async
   * @param nick {String} Kullanıcı Adı
   * @param params {Object}
   * @return {Promise}
   */
  async setUserUnfollow(nick, params = {}) {
    return await this.client.get(
      `${this.client_version}/user/${nick}/unfollow`,
      {
        params
      }
    )
  }

  /**
   * Başka bir kullanıcıya ait entryleri erişmek için
   * @async
   * @param nick {String} Kullanıcı adı
   * @param params {Object}
   * @param params.p {Number} Sayfa sayısı
   * @return {Promise}
   */
  async getUserEntrys(nick, params = { p: 1 }) {
    return await this.client.get(
      `${this.client_version}/user/${nick}/entries`,
      { params }
    )
  }

  /**
   * Başka bir kullanıcıya ait favorileri erişmek için
   * @async
   * @param nick {String} Kullanıcı adı
   * @param params {Object}
   * @param params.p {Number} Sayfa sayısı
   * @return {Promise}
   */
  async getUserFavorites(nick, params = { p: 1 }) {
    return await this.client.get(
      `${this.client_version}/user/${nick}/favorites`,
      { params }
    )
  }

  /**
   * Kendinize ait mesajlara erişmek için
   * @async
   * @param params {Object}
   * @param params.p {Number} Sayfa sayısı
   * @return {Promise}
   */
  async getMessages(params = { p: 1 }) {
    return await this.client.get(`${this.client_version}/message`, { params })
  }

  /**
   * Takip ettiğiniz konuların listesi için
   * @async
   * @param params {Object}
   * @param params.p {Number} Sayfa sayısı
   * @return {Promise}
   */
  async getEvents(params = { p: 1 }) {
    return await this.client.get(`${this.client_version}/index/olay`, {
      params
    })
  }

  /**
   * Mesajı getirmek için
   * @async
   * @param nick {String} Kullanıcı adı
   * @param params {Object}
   * @param params.p {Number} Sayfa sayısı
   * @return {Promise}
   */
  async getMessage(nick, params = { p: 1 }) {
    return await this.client.get(
      `${this.client_version}/message/thread/nick/${nick}`,
      { params }
    )
  }

  /**
   * Kendinize ait okunmamış mesaj sayısı
   * @async
   * @param params {Object}
   * @return {Promise}
   */
  async getMyUnreadMessagesCount(params = {}) {
    return await this.client.get(
      `${this.client_version}/message/totalunreadthreadcount`,
      { params }
    )
  }

  /**
   * Takip edilen okunmamış konular'a ait okunmamış konu sayısı
   * @async
   * @param params {Object}
   * @return {Promise}
   */
  async getMyUnreadTopicsCount(params = {}) {
    return await this.client.get(
      `${this.client_version}/topic/unreadtopiccount`,
      { params }
    )
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
    return await this.client.get(
      `${this.client_version}/topic/${topic_id}/today`,
      { params }
    )
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
    return await this.client.get(`${this.client_version}/topic/${topic_id}`, {
      params
    })
  }

  /**
   * Bugün girilen konular
   * @async
   * @param params {Object}
   * @param params.p {Number} Sayfa sayısı
   * @return {Promise}
   */
  async getTodayTopics(params = { p: 1 }) {
    return await this.client.get(`${this.client_version}/index/today`, {
      params
    })
  }

  /**
   * Bugün girilen popüler konular
   * @async
   * @param params {Object}
   * @param params.p {Number} Sayfa sayısı
   * @return {Promise}
   */
  async getPopularTopics(params = { p: 1 }) {
    return await this.client.get(`${this.client_version}/index/popular`, {
      params
    })
  }

  /**
   * Takip ettiğiniz yazarların entry girdiği konular
   * @async
   * @param params {Object}
   * @param params.p {Number} Sayfa sayısı
   * @return {Promise}
   */
  async getMyBuddysTopics(params = { p: 1 }) {
    return await this.client.get(`${this.client_version}/index/feed/entry`, {
      params
    })
  }

  /**
   * Takip ettiğiniz yazarların favorilediği entryler
   * @async
   * @param {Object} params - ##
   * @return {Promise}
   */
  async getMyBuddysFavorites(params = { p: 1 }) {
    return await this.client.get(
      `${this.client_version}/index/feed/favorites`,
      { params }
    )
  }

  /**
   * Ekşi sözlük kanalları
   * @async
   * @param {Object} params - ##
   * @return {Promise}
   */
  async getChannels(params = {}) {
    return await this.client.get(`${this.client_version}/channel/list`, {
      params
    })
  }

  /**
   * Ekşi sözlük Kanallarına ait konuları getirmek için
   * @async
   * @param name {String} Kanal Adı
   * @param {Object} params - ##
   * @param {Object} params.p - Sayfa sayısı
   * @return {Promise}
   */
  async getChannel(name, params = { p: 1 }) {
    return await this.client.get(
      `${this.client_version}/index/channel/${name}`,
      { params }
    )
  }

  /**
   *
   * @async
   * @param query {String}  Aranan kelime
   * @return {Promise}
   */
  async getAutoCompletes(query) {
    return await this.client.get(
      `${this.client_version}/autocomplete/query/${query}`
    )
  }

  /**
   *
   * @async
   * @param params {Object}
   * @param params.term {String} Aranan kelime
   * @return {Promise}
   * @todo not working
   */
  async setSearch(params = { term: null }) {
    return await this.client.get(`${this.client_version}/topic/query`, {
      params
    })
  }
}

export default EksiClient
