<template>
  <div id="app" class="container mx-auto " v-on:keyup.esc="closeModal">
    <h1>Showroom</h1>
    <div>
      <draggable
        v-model="items"
        group="people"
        @start="drag = true"
        @end="drag = false"
        @change="reorder"
        class="grid grid-cols-2 gap-4"
      >
        <List
          v-for="item in items"
          :key="item._id"
          :item="item"
          @edit="edit(item._id)"
          @remove="remove(item._id)"
          class="col-span-2 md:col-span-1 "
        />
      </draggable>
    </div>

    <hr />
    <footer class="p-4">
      <div class="inline-block py-2 px-4 rounded border-l-2 border-orange-500">
        {{ items.length }} items
      </div>
      <button @click="this.add" class="btn">
        Add
      </button>
    </footer>
    <!-- ++++++++++++++++++ Modal ++++++++++++++++++ -->
    <Modal v-if="showModal">
      <div class="">
        <form>
          <div class="grid grid-cols-4">
            <div class="col-span-1">
              <img
                id="myModal_thumbnail"
                :src="this.modal.thumb"
                class="m-2 ml-0"
              />
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
    </Modal>
  </div>
</template>

<script>
import List from "./components/List.vue";
import Modal from "./components/Modal.vue";
import axios from "axios";
import _ from "lodash";
import gray from "./assets/gray.jpg";
import draggable from "vuedraggable";

// eslint-disable-next-line no-unused-vars

const APIURL = process.env.VUE_APP_APIURL;
const MAXLENGTH = 300;

export default {
  name: "App",
  components: { List, Modal, draggable },
  data() {
    return {
      items: [],
      showModal: false,
      modal: {
        title: "",
        text: "",
        image: "",
        id: "",
        thumb: gray,
        error: "",
      },
    };
  },
  computed: {},
  created() {
    this.init();
  },
  methods: {
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
    closeModal() {
      this.showModal = false;
    },
    getFile() {
      const thumb = document.querySelector("#image1");
      thumb.click();
    },
    reorder(o) {
      const second = this.items[o.moved.oldIndex];
      axios.put(APIURL + "/api/items/" + o.moved.element._id, {
        order: o.moved.newIndex + 1,
      });

      axios.put(APIURL + "/api/items/" + second._id, {
        order: o.moved.oldIndex + 1,
      });
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
    init() {
      const vm = this;
      axios
        .get(APIURL + "/api/items")
        .then(function(response) {
          response.data.forEach((o) => {
            vm.items.push(o);
          });
        })
        .catch(console.log);
    },
    edit(id) {
      this.showModal = true;
      const row = _.find(this.items, function(o) {
        return o._id == id;
      });
      this.modal.id = row._id;
      this.modal.title = row.title;
      this.modal.text = row.text;
      this.modal.image = row.image;
      this.modal.thumb = row.image ? APIURL + "/images/" + row.image : gray;
    },
    add() {
      this.showModal = true;
      this.modal.id = "";
      this.modal.title = "";
      this.modal.text = "";
      this.modal.image = "";
      this.modal.thumb = "";
    },
    remove(id) {
      axios
        .delete(APIURL + "/api/items/" + id)
        .then(() => {
          this.items = _.filter(this.items, function(o) {
            return o._id !== id;
          });
          this.showModal = false;
        })
        .catch(console.log);
    },
    save() {
      // Update
      if (this.modal.id) {
        const formData = new FormData();
        const thumb = document.querySelector("#image1").files[0];
        if (thumb) {
          formData.append("image", thumb);
        }
        formData.append("text", this.modal.text);
        formData.append("title", this.modal.title);

        axios
          .put(APIURL + "/api/items/" + this.modal.id, formData)
          .then((r) => {
            const vm = this;
            const row = _.find(this.items, function(o) {
              return o._id == vm.modal.id;
            });
            row.title = this.modal.title;
            row.text = this.modal.text;
            if (thumb) {
              row.image = r.data.image;
            }

            this.showModal = false;
          })
          .catch(console.log);
      } else {
        // New
        const formData = new FormData();
        formData.append("image", document.querySelector("#image1").files[0]);
        formData.append("text", this.modal.text);
        formData.append("title", this.modal.title);
        formData.append("order", this.items.length + 1);

        axios
          .post(APIURL + "/api/items/", formData)
          .then((o) => {
            this.items.push(o.data);
            this.showModal = false;
          })
          .catch(console.log);
      }
    },
  },
};
</script>
