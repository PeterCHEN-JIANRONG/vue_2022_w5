/* global axios,Vue,VeeValidate,VeeValidateRules,VeeValidateI18n */
// eslint-disable-next-line import/extensions
import userProductModal from './component/userProductModal.js';
import pagination from './component/Pagination.js';
import emitter from "./methods/emitter.js";

const { defineRule, Form, Field, ErrorMessage, configure } = VeeValidate;
const { required, email, min, max } = VeeValidateRules;
const { localize, loadLocaleFromURL } = VeeValidateI18n;

// 載入規則
defineRule('required', required);
defineRule('email', email);
defineRule('min', min);
defineRule('max', max);

// 載入多國語系
loadLocaleFromURL('https://unpkg.com/@vee-validate/i18n@4.1.0/dist/locale/zh_TW.json');

// Activate the locale
configure({
  generateMessage: localize('zh_TW'),
  validateOnInput: true, // 調整為輸入字元立即進行驗證
});

// 全域設定
const apiUrl = 'https://vue3-course-api.hexschool.io/v2';
const apiPath = 'peter_vue2022';

const app = Vue.createApp({
  data() {
    return {
      products: [],
      pagination: {},
      cartData: [],
      productId: '',
      isLoading: false,
      isLoadingItem: '',
      form: {
        user: {
          name: '',
          email: '',
          tel: '',
          address: '',
        },
        message: '',
      },
    };
  },
  components: {
    VForm: Form,
    VField: Field,
    ErrorMessage,
    pagination,
  },
  methods: {
    getProducts(page = 1) {
      this.isLoading = true;
      const url = `${apiUrl}/api/${apiPath}/products?page=${page}`;
      axios.get(url).then((res) => {
        this.isLoading = false;
        this.products = res.data.products;
        this.pagination = res.data.pagination;
        document.documentElement.scrollTop = 0; // 頁面置頂
      }).catch((err) => {
        this.isLoading = false;
        alert(err.data.message);
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
      const url = `${apiUrl}/api/${apiPath}/cart`;
      axios.get(url).then((res) => {
        this.cartData = res.data.data;
      }).catch((err) => {
        alert(err.data.message);
      });
    },
    addToCart(id, qty = 1) {
      this.isLoadingItem = id;
      const data = {
        product_id: id,
        qty,
      };
      const url = `${apiUrl}/api/${apiPath}/cart`;
      axios.post(url, { data }).then((res) => {
        this.isLoadingItem = '';
        this.getCart();
        this.$refs.productModal.closeModal();
      }).catch((err) => {
        alert(err.data.message);
      });
    },
    updateCart(item) {
      const data = {
        product_id: item.product_id,
        qty: item.qty,
      };
      this.isLoadingItem = item.id;
      const url = `${apiUrl}/api/${apiPath}/cart/${item.id}`;
      axios.put(url, { data }).then((res) => {
        this.isLoadingItem = '';
        this.getCart();
      }).catch((err) => {
        alert(err.data.message);
      });
    },
    removeCart(id) {
      this.isLoadingItem = id;
      const url = `${apiUrl}/api/${apiPath}/cart/${id}`;
      axios.delete(url).then((res) => {
        this.isLoadingItem = '';
        alert(res.data.message);
        this.getCart();
      }).catch((err) => {
        alert(err.data.message);
      });
    },
    removeCartAll() {
      this.isLoadingItem = true;
      const url = `${apiUrl}/api/${apiPath}/carts`;
      axios.delete(url).then((res) => {
        this.isLoadingItem = '';
        this.getCart();
        alert(res.data.message);
      }).catch((err) => {
        alert(err.data.message);
      });
    },
    createOrder() {
      this.isLoadingItem = true;
      this.isLoading = true;
      const url = `${apiUrl}/api/${apiPath}/order`;
      axios.post(url, { data: this.form }).then((res) => {
        this.isLoadingItem = '';
        this.isLoading = false;
        this.getCart();
        this.$refs.form.resetForm();
        alert(res.data.message);
      }).catch((err) => {
        alert(err.data.message);
      });
    },
  },
  mounted() {
    this.getProducts();
    this.getCart();
    emitter.on('loading', (state) => {
      this.isLoading = state;
    });
  },
  unmounted() {
    emitter.off('loading', (state) => {
      this.isLoading = state;
    });
  },
});

app.component('productModal', userProductModal);
app.component('Loading', VueLoading.Component);

app.mount('#app');
