<template>
  <div class=" bg-gray-100 grid grid-cols-3 gap-4 mb-4 mt-4 shadow">
    <div class="col-span-1 p-4">
      <img alt="Picture" :src="image" class="" />
    </div>
    <div class="col-span-2 p-4">
      <h1>{{ item.title }}</h1>
      <p class="mb-2">{{ item.text }}</p>
      <button @click="this.edit" class="btn mr-2">Edit</button>
      <button @click="this.remove" class="btn">
        Delete
      </button>
    </div>
  </div>
</template>

<script>
import gray from "../assets/gray.jpg";

export default {
  name: "List",
  props: ["item", "ix"],
  data() {
    return {};
  },
  methods: {
    edit() {
      this.$emit("edit");
    },
    remove() {
      this.$emit("remove");
    },
  },
  computed: {
    image: function() {
      //return `${process.env.VUE_APP_APIURL}/images/${this.item.image}`;
      return this.item.image
        ? `${process.env.VUE_APP_APIURL}/images/${this.item.image}`
        : gray;
    },
  },
};
</script>

<style></style>
