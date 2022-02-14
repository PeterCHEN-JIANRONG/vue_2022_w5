/* global axios */
// eslint-disable-next-line
import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.31/vue.esm-browser.min.js';

const app = createApp({
  data() {
    return {
      apiUrl: 'https://vue3-course-api.hexschool.io/v2',
      apiPath: 'peter_vue2022',
      products: [],
    };
  },
  methods: {
    getProducts() {
      const url = `${this.apiUrl}/api/${this.apiPath}/products/all`;
      axios.get(url).then((res) => {
        this.products = res.data.products;
      });
    },
  },
  mounted() {
    this.getProducts();
  },
});

app.mount('#app');
