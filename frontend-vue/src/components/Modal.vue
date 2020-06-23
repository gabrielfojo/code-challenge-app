<template>
  <div
    class="fixed inset-0 w-auto mx-32 h-screen flex items-center justify-center bg-semi-75 "
  >
    <div class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 ">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "Modal",
  props: [],
  data() {
    return {};
  },
};
</script>

<style></style>
