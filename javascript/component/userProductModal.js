/* global axios,bootstrap */
// const emitter = mitt();
import emitter from "../emitter.js";

export default {
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
      emitter.emit('loading', true);
      const url = `${this.apiUrl}/api/${this.apiPath}/product/${this.productId}`;
      axios.get(url).then((res) => {
        emitter.emit('loading', false);
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
};
