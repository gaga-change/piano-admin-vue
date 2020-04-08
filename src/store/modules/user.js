import { getInfo } from '@/api'
import { MessageBox } from 'element-ui';

const user = {
  state: {
    userInfo: null,
    company: null,
    companyId: null,
    permissionCodes: [],
    chooseWarehouse: null,
    roles: [],
    warehouseMap: [],
    todolist: null
  },

  mutations: {
    SET_USERINFO: (state, info) => {
      state.userInfo = info
    },
    SET_TODOLIST: (state, todolist) => {
      state.todolist = todolist
    },
  },

  actions: {
    // 获取用户信息
    GetInfo({ commit, state }) {
      console.log('GetInfo')
      return getInfo().then(res => {
        if (res) {
          const data = res
          commit('SET_USERINFO', data)
        }
        return res
      })
    },
    setTodolist({ commit }, todolist) {
      commit('SET_TODOLIST', todolist)
    }
  }
}



export default user
