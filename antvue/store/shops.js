export const state = () => ({
    list: []
  })
  
  export const mutations = {
    add(state, shop) {
      state.list.push(shop)
    },
    emptyList(state) {
      state.list = []
    }
  }
  
  export const getters = {
    list: state => {
      return state.list
    }
  }