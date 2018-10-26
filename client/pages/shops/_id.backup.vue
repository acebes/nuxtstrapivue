<template>
  <section class="container">
    <div>
      <h1 class="mt-2">Dishes</h1>
      <div class="row">
        <div class="col-md-8">
          <div class="card-columns">
            <div 
              v-for="item in items" 
              :key="item.id" 
              class="card">
              <div 
                v-for="(image, index) in item.image"
                :key="index">
                <img 
                  :src="strapiurl + image.url" 
                  class="card-img-top" 
                  alt="Card image cap">
              </div>
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





<template>
  <section class="container">
    <div>
      <h1 class="mt-2">Items</h1>
      <div class="row">
        <div class="col-md-8">
          <div class="card-columns">
            <div 
              v-for="Item in items" 
              :key="Item.id" 
              class="card">
              <img 
                :src="Item.image[0].url" 
                class="card-img-top">
              <div class="card-body">
                <h5 class="card-title">{{ Item.name }}</h5>
                <p class="card-text">{{ Item.description || 'No description provided.' }}</p>
                <p class="card-text">${{ Item.price }}</p>
                <button 
                  class="btn btn-primary" 
                  @click="addToCard(Item)">Add to card</button>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">Card</h5>
              <p class="card-text">{{ numberOfItems }} items selected:</p>
              <ul>
                <li 
                  v-for="Item in selectedItems" 
                  :key="Item.id" 
                  class="card-text mb-2">
                  Name: {{ Item.name }} (${{ Item.price }}) ({{ Item.quantity }})
                  <button 
                    class="btn btn-sm btn-success" 
                    @click="addToCard(Item)">+</button>
                  <button 
                    class="btn btn-sm btn-warning ml-2"
                    @click="removeFromCard(Item)">-</button>
                </li>
              </ul>
              <h5 class="card-text">
                Total: ${{ price }}
              </h5>
              <p v-if="!selectedItems.length">Please select some items.</p>
              <button 
                :disabled="!selectedItems.length" 
                class="btn btn-primary" 
                @click="goToCheckout">Order</button>
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