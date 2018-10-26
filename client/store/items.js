export const state = () => ({
    list: []
  })
  
  export const mutations = {
    add(state, item) {
      state.list.push(item)
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