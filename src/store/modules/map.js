import * as localEnum from '@/utils/enum'

import { enumsTotal } from '@/api'

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
  const data = await enumsTotal()
  data.forEach(v => {
    config[v.name] = v.keyValue
  })
  Object.keys(localEnum).forEach(key => {
    config[key] = localEnum[key]
  })
  return config
}

export default map
