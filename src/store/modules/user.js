import { getInfo } from '@/api'
const user = {
  state: {
    userInfo: null,
    company: null,
    companyId: null,
    permissionCodes: [],
    chooseWarehouse: null,
    roles: [],
    warehouseMap: [],
  },

  mutations: {
    SET_USERINFO: (state, info) => {
      state.userInfo = info
    },
  },

  actions: {
    // 获取用户信息
    GetInfo({ commit, state }) {
      return getInfo().then(res => {
        if (res) {
          const data = res
          commit('SET_USERINFO', data)
        }
        return res
      })
    },
  }
}



export default user
