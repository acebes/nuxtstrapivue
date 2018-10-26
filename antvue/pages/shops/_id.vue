<template>
  <section class="container">
    <div>
      <h1 class="mt-2">Items</h1>
      <div class="row">
        <div class="col-md-8">
          <div class="card-columns">
            <div 
              v-for="item in items" 
              :key="item.id" 
              class="card">
              <img 
                :src="strapiurl + item.image[0].url" 
                class="card-img-top" 
                alt="Card image cap">
              <div class="card-body">
                <h5 class="card-title">{{ item.name }}</h5>
                <p class="card-text">{{ item.description || 'No description provided.' }}</p>
                <p class="card-text">${{ item.price }}</p>
                <button class="btn btn-primary">Add to card</button>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">Card</h5>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import Strapi from "strapi-sdk-javascript/build/main";
const apiUrl = process.env.API_URL || "http://localhost:1337";
const strapi = new Strapi(apiUrl);
export default {
  computed: {
    id() {
      return this.$route.params.id;
    },
    items() {
      return this.$store.getters["items/list"];
    },
    strapiurl() {
      return apiUrl;
    }
  },
  async fetch({ store, params }) {
    store.commit("items/emptyList");
    const response = await strapi.request("post", "/graphql", {
      data: {
        query: `query {
            shop(id: "${params.id}") {
              id
              name
              items {
                id
                name
                description
                price
                image {
                  url
                }
              }
            }
          }
          `
      }
    });
    response.data.shop.items.forEach(item => {
      item.image.url = `${apiUrl}${item.image.url}`;
      store.commit("items/add", {
        id: item.id || item.id,
        ...item
      });
    });
  }
};
</script>