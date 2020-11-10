<template>
  <div
    class="fixed inset-0 w-auto mx-32 h-screen flex items-center justify-center bg-semi-75 "
  >
    <div class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 ">
      <form>
        <div class="grid grid-cols-4">
          <div class="col-span-1">
            <img id="myModal_thumbnail" :src="modal.thumb" class="m-2 ml-0" />
            <input
              type="file"
              name=""
              id="image1"
              @change="updateThumb"
              class="hidden"
            />
            <div class="flex items-left mt-3">
              <button class="btn w-full" type="button" @click="getFile">
                Pick file
              </button>
            </div>
          </div>

          <div class="col-span-3 ml-4">
            <div class="mt-2 mb-4">
              <label
                class="block text-gray-700 text-sm font-bold mb-2"
                for="title"
              >
                Title
              </label>
              <input
                class=" shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="title"
                type="text"
                placeholder="Title"
                v-model="modal.title"
              />
            </div>
            <div class="mb-4">
              <label
                class="block text-gray-700 text-sm font-bold mb-2"
                for="text"
              >
                Text
              </label>
              <textarea
                class="shadow appearance-none border  rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                id="text"
                type="text"
                placeholder="A penny for your thoughts..."
                v-model="modal.text"
              />
            </div>
            <div class="grid grid-cols-2">
              <button class="btn w-full" type="button" @click="save">
                Save
              </button>
              <span :class="textClass()" class="pt-2  text-right pr-2">{{
                300 - modal.text.length
              }}</span>
            </div>
          </div>
        </div>

        <div class="mb-6"></div>

        <span v-if="modal.error">
          {{ modal.error }}
        </span>
      </form>
    </div>
  </div>
</template>

<script>
const MAXLENGTH = 300;

export default {
  name: "Modal",
  props: ["modal"],
  data() {
    return {};
  },
  methods: {
    save() {
      this.$emit("save", this.modal);
    },
    textClass() {
      let color = "";
      let left = MAXLENGTH - this.modal.text.length;

      if (left < 100) {
        color = "text-red-700";
      } else if (left < 200) {
        color = "text-orange-700";
      } else {
        color = "text-green-700";
      }

      return color;
    },
    getFile() {
      const thumb = document.querySelector("#image1");
      thumb.click();
    },
    updateThumb(ev) {
      const input = ev.target;
      const fileTypes = ["image/jpeg", "image/gif", "image/png"];
      const vm = this;
      if (input.files && input.files[0]) {
        if (!fileTypes.includes(input.files[0].type)) {
          console.log(">Try again..");
          this.modal.thumb = "";
          return false;
        }
        var reader = new FileReader();
        reader.onload = function(e) {
          var image = new Image();
          image.src = e.target.result;
          image.onload = function() {
            var height = this.height;
            var width = this.width;
            if (height == 320 && width === 320) {
              vm.modal.thumb = e.target.result;
            } else {
              vm.modal.error = "Image 320x320 please";
              return false;
            }
          };
        };
        reader.readAsDataURL(input.files[0]);
      }
    },
  },
};
</script>

<style></style>
