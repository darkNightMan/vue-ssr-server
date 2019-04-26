import Vue from 'vue';
import axios from 'axios';
import Vuex from 'vuex';

Vue.use(Vuex);

export  function createStore() {
  return new Vuex.Store({
    state: {
      article: {},
      weather: {}
    },
    actions: {
      async GET_ARTICLE({commit}) {
        try {
          const {data} = await axios.get('api/article')
          commit('SET_ARTICLE', data.data)
        } catch (ex) {
          console.log(ex)
        }
      },

      async GET_WEATHER ({commit}) {
        try {
        const { data } = await axios.get('api/weather')
        commit('SET_WEATHER', data.data.data)
        } catch (ex) {
          console.log(ex)
        }
      },
    },
    mutations: {
      SET_ARTICLE(state, data) {
        state.article = data.data
      },
      SET_ARTICLE_VIEWS (state, data) {
        state.article.views = data
      },
      SET_WEATHER(state, data) {
        state.weather = data
      }
    }
  })
}