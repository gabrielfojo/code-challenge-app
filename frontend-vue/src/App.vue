<template>
  <div id="app" class="container mx-auto " v-on:keyup.esc="closeModal">
    <h1>My App</h1>
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
    <!-- ++++++++++++++++++ Footer ++++++++++++++++++ -->
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
    <Modal v-if="showModal" :modal="modal" @save="save"> </Modal>
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
// const MAXLENGTH = 300;

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
    closeModal() {
      this.showModal = false;
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
    save(myData) {
      // Update

      if (myData.id) {
        const formData = new FormData();
        const thumb = document.querySelector("#image1").files[0];
        if (thumb) {
          formData.append("image", thumb);
        }
        formData.append("text", myData.text);
        formData.append("title", myData.title);

        axios
          .put(APIURL + "/api/items/" + myData.id, formData)
          .then((r) => {
            const vm = this;
            const row = _.find(this.items, function(o) {
              return o._id == vm.modal.id;
            });
            row.title = myData.title;
            row.text = myData.text;
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
        formData.append("text", myData.text);
        formData.append("title", myData.title);
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
