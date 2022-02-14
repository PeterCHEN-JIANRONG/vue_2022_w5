/* global axios,bootstrap */
// eslint-disable-next-line
import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.31/vue.esm-browser.min.js';

const app = createApp({
  data() {
    return {
      apiUrl: 'https://vue3-course-api.hexschool.io/v2',
      apiPath: 'peter_vue2022',
      products: [],
      cartData: [],
      productId: '',
      isLoadingItem: '',
    };
  },
  methods: {
    getProducts() {
      const url = `${this.apiUrl}/api/${this.apiPath}/products/all`;
      axios.get(url).then((res) => {
        this.products = res.data.products;
      });
    },
    openProductModal(id) {
      if (this.productId === id) {
        this.$refs.productModal.openModal(); // productId相同直接開啟Modal
      } else {
        this.productId = id; // productId改變，重新取得product
      }
    },
    getCart() {
      const url = `${this.apiUrl}/api/${this.apiPath}/cart`;
      axios.get(url).then((res) => {
        this.cartData = res.data.data;
      });
    },
    addToCart(id, qty = 1) {
      this.isLoadingItem = id;
      const data = {
        product_id: id,
        qty,
      };
      const url = `${this.apiUrl}/api/${this.apiPath}/cart`;
      axios.post(url, { data }).then((res) => {
        if (res.data.success) {
          this.isLoadingItem = '';
          this.getCart();
          this.$refs.productModal.closeModal();
        }
      });
    },
    updateCart(item) {
      const data = {
        product_id: item.product_id,
        qty: item.qty,
      };
      this.isLoadingItem = item.id;
      const url = `${this.apiUrl}/api/${this.apiPath}/cart/${item.id}`;
      axios.put(url, { data }).then((res) => {
        if (res.data.success) {
          this.isLoadingItem = '';
          this.getCart();
        }
      });
    },
    removeCart(id) {
      this.isLoadingItem = id;
      const url = `${this.apiUrl}/api/${this.apiPath}/cart/${id}`;
      axios.delete(url).then((res) => {
        if (res.data.success) {
          this.isLoadingItem = '';
          alert(res.data.message);
          this.getCart();
        }
      });
    },
    removeCartAll() {
      this.isLoadingItem = true;
      const url = `${this.apiUrl}/api/${this.apiPath}/carts`;
      axios.delete(url).then((res) => {
        if (res.data.success) {
          this.isLoadingItem = '';
          alert(res.data.message);
          this.getCart();
        }
      });
    },
  },
  mounted() {
    this.getProducts();
    this.getCart();
  },
});

app.component('productModal', {
  template: '#userProductModal',
  props: ['productId'],
  data() {
    return {
      modal: null,
      product: {},
      apiUrl: 'https://vue3-course-api.hexschool.io/v2',
      apiPath: 'peter_vue2022',
      qty: 1,
    };
  },
  watch: {
    productId() {
      this.getProduct();
    },
  },
  methods: {
    openModal() {
      this.qty = 1;
      this.modal.show();
    },
    closeModal() {
      this.modal.hide();
    },
    getProduct() {
      const url = `${this.apiUrl}/api/${this.apiPath}/product/${this.productId}`;
      axios.get(url).then((res) => {
        this.product = res.data.product;
        this.openModal();
      });
    },
    addCart() {
      this.$emit('add-cart', this.product.id, this.qty);
    },
  },
  mounted() {
    this.modal = new bootstrap.Modal(this.$refs.modal, {
      backdrop: true,
      keyboard: true,
      focus: true,
    });
  },
});

app.mount('#app');
