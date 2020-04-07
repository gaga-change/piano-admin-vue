// import { enumsTotal } from '@/api'
import enums from '../enums.json'

const map = {
  state: {
    mapConfig: {},
  },
  mutations: {
    SET_MAP: (state, config) => {
      state.mapConfig = config
    },
    ADD_MAP: (state, item) => {
      let temp = { ...state.mapConfig }
      temp[item.name] = item.keyValue
      state.mapConfig = temp
    }
  },

  actions: {
    // 获取枚举信息
    gitMap({ commit, state }) {
      config().then(res => {
        commit('SET_MAP', res);
      })
    }
  }
}

async function config() {
  let config = {};
  // const data = await enumsTotal()
  const data = enums
  data.forEach(v => {
    config[v.name] = v.keyValue
  })
  return config
}

export default map
