
const tempData = {
  state: {
    arrivalBill:[],//到货单数据
  },
  
  mutations: {
    SET_ARRIVALBILL:(state,data) => {
      state.arrivalBill = [...data]
    }
  },

  actions: {
    storeArrivalBill:({commit},data) => {
      commit('SET_ARRIVALBILL',data)
    }
  }
}

export default tempData
