"use strict";

import _ from "lodash";
import "./style.css";
import List from "./components/List";
import Modal from "./components/Modal";
import Alert from "./components/Alert";
import Loading from "./components/Loading";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import grayThumb from "./images/gray.jpg";

require("webpack-jquery-ui/interactions");
require("webpack-jquery-ui/css");

console.log("mode", process.env.NODE_ENV);
console.log("APIURL", APIURL);

var items = [];

var myApp = document.getElementById("app");

const state = {
  modal_title: "",
  modal_text: "",
  modal_id: "",
  modal_heading: "",
  modal_image: "",
  loading: true,
};

var app = (function () {
  function setState(k, v) {
    if (k in state) {
      state[k] = v;
      render(myApp);
    }
  }

  function init(el) {
    const template = `
        <h1>My App</h1>
        <hr/>  
        ${Loading(items)}
        <button  class="btn btn-light">
        Items <span class="badge badge-light">0</span>
        </button>
        <button class="btn btn-info" id="btn_add">Add</button>
        `;
    el.innerHTML = template;

    axios
      .get(APIURL + "/api/items")
      .then(function (response) {
        items = response.data;
        render(myApp);
      })
      .catch(console.log);
  }

  function render(el) {
    const template = `
            <h1>My App</h1>
            <div class="list-group" id="sortable">
            ${List(items)}
            </div>
            <hr/>  
            <button  class="btn btn-light">
            Items <span class="badge badge-light">${getCount()}</span>
            </button>
            <button class="btn btn-info" id="btn_add">Add</button>
            ${Modal(state)}
        `;
    el.innerHTML = template;
    // Update soerteables
    $("#sortable").sortable({
      placeholder: "highlight",
      stop: function (event, ui) {
        const order = [];
        $(this)
          .find("a")
          .each(function (index) {
            order.push({ id: $(this).attr("data-id"), order: index });
          });

        const changeOrder = order.filter((o) => {
          const row = _.find(items, function (_) {
            return _._id === o.id;
          });
          return !(row.order === o.order);
        });

        axios
          .put(APIURL + "/api/items/order", changeOrder)
          .then(console.log)
          .catch(console.log);
      },
    });
    $("#sortable").disableSelection();
  }

  function getCount() {
    return items.length;
  }

  function save(data) {
    // console.log(data);
    // items.push({text: data.text,id:items.length+1});
    // $( document ).trigger( "/update");
  }

  function remove(id) {
    items.splice(id - 1, 1);
    app.render(myApp);
  }

  return {
    init,
    render,
    getCount,
    save,
    remove,
    setState,
  };
})();

app.init(myApp);

//== Events handlers

// New Item
$(document).on("click", "#btn_add", function (event, data) {
  app.setState("modal_title", "");
  app.setState("modal_text", "");
  app.setState("modal_id", "");
  app.setState("modal_image", grayThumb);
  app.setState("modal_heading", "New item:");
  app.render(myApp);
  $("#myModal").modal("show");
});

// Save item
$(document).on("submit", "form", function (event) {
  event.preventDefault();
  const formData = new FormData(this);

  if (state.modal_id) {
    // Update
    axios
      .put(APIURL + "/api/items/" + state.modal_id, formData)
      .then((_) => {
        app.init(myApp);
      })
      .catch(console.log);
  } else {
    formData.append("order", app.getCount());
    // New
    axios
      .post(APIURL + "/api/items", formData)
      .then((_) => {
        app.init(myApp);
      })
      .catch(console.log);
  }

  $("#myModal").modal("hide");
});

//== Delete item
$(document).on("click", "button[data-type='btn_delete']", function (
  event,
  data
) {
  const _id = $(this).attr("data-id");
  const endpoint = APIURL + "/api/items/" + _id;
  _.remove(items, function (o) {
    return o._id === _id;
  });
  app.render(myApp);
  axios.delete(endpoint).then(console.log).catch(console.log);
});

//== Update item
$(document).on("click", "button[data-type='btn_edit']", function (event, data) {
  state.modal_error = 0;
  const id = $(this).attr("data-id");
  const row = items.find((o) => o._id == id);
  const img = row.image ? APIURL + "/images/" + row.image : "";

  app.setState("modal_title", row.title);
  app.setState("modal_text", row.text);
  app.setState("modal_id", id);
  app.setState("modal_image", img);
  app.setState("modal_heading", "Update: " + id);
  app.render(myApp);
  $("#myModal").modal("show");
});

//== Modal image change
$(document).on("change", "#myModal_image", function (event) {
  readURL(this);
});

$(document).on(
  "input",
  "#myModal_description",
  _.debounce(function () {
    let len = 300 - $(this).val().length;
    let myClass = "text-success";

    if (len < 0) $("#myModal_save").attr("disabled", "disabled");

    if (len > 0 && $("#myModal_save").attr("disabled"))
      $("#myModal_save").removeAttr("disabled");

    if (len < 50) myClass = "text-danger";
    else if (len < 200) myClass = "text-warning";

    $("#myModal_len").html(`<small class="${myClass}">${len}</small>`);
  }, 100)
);

//==== Helpers

// Local image getter
function readURL(input) {
  const fileTypes = ["image/jpeg", "image/gif", "image/png"];

  if (input.files && input.files[0]) {
    if (!fileTypes.includes(input.files[0].type)) {
      $("#myModal_error").html(
        Alert({ msg: "<strong>Try again..</strong> ( jpg | gif | png )" })
      );
      $("#myModal_save").attr("disabled", "disabled");
      return false;
    }
    var reader = new FileReader();

    reader.onload = function (e) {
      var image = new Image();
      image.src = e.target.result;
      image.onload = function () {
        var height = this.height;
        var width = this.width;

        if (this.height == 320 && this.width === 320) {
          $("#myModal_thumbnail").attr("src", e.target.result);
          $("#myModal_save").removeAttr("disabled");
        } else {
          $("#myModal_error").html(
            Alert({ msg: "<strong>Try again..</strong> ( 320 x 320 )" })
          );
          $("#myModal_save").attr("disabled", "disabled");
          return false;
        }
      };
    };

    reader.readAsDataURL(input.files[0]);
  }
}

// Reactivity
$(document).on("change", "input[data-model],textarea[data-model]", function (
  event,
  data
) {
  const model = $(this).attr("data-model");
  if (model in state) {
    state[model] = $(this).val();
  }
});
