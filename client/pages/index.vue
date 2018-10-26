<template>
  <section class="container">
    <div class="row">
      <div class="col-md-12">
        <div class="form-group mt-3">
          <input 
            v-model="query" 
            type="text" 
            class="form-control" 
            placeholder="Search...">
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-md-12">
        <ul class="card-columns list-unstyled">
          <li 
            v-for="shop in filteredList" 
            :key="shop.id" 
            class="card">
            <img 
              :src="shop.image.url" 
              class="card-img-top">
            <div class="card-body">
              <h5 class="card-title">{{ shop.name }}</h5>
              <h5 class="card-title">{{ shop.branch }}</h5>
              <p class="card-text">{{ shop.description || 'No description provided' }}.</p>
              <router-link 
                :to="{ name: 'shops-id', 
                       params: { id: shop.id }}" 
                tag="a" 
                class="btn btn-primary">
                See dishes
              </router-link>
            </div>
          </li>
          <p v-if="!filteredList.length">No results :(</p>
        </ul>
      </div>
    </div>
  </section>
</template>

<script>
import Strapi from "strapi-sdk-javascript/build/main";
const apiUrl = process.env.API_URL || "http://localhost:1337";
const strapi = new Strapi(apiUrl);
export default {
  data() {
    return {
      query: ""
    };
  },
  computed: {
    filteredList() {
      return this.shops.filter(shop => {
        return shop.name.toLowerCase().includes(this.query.toLowerCase());
      });
    },
    shops() {
      return this.$store.getters["shops/list"];
    }
  },
  async fetch({ store }) {
    store.commit("shops/emptyList");
    const response = await strapi.request("post", "/graphql", {
      data: {
        query: `query {
            shops {
              id
              name
              branch
              description
              image {
                url
              }
            }
          }
          `
      }
    });
    response.data.shops.forEach(shop => {
      shop.image.url = `${apiUrl}${shop.image.url}`;
      store.commit("shops/add", {
        id: shop.id || shop._id,
        ...shop
      });
    });
  }
};
</script>