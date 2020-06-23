const Item = require("../models/item");
var _ = require("lodash");

//== Get Items
exports.getItems = async (req, res, next) => {
  const arr = await Item.find({}).sort({ order: 1 });
  res.json(arr);
};

//== Save Item
exports.saveItem = (req, res, next) => {
  req.body.image = req.file ? req.file.filename : "";
  const form = new Item(req.body);
  form
    .save()
    .then((o) => {
      res.json(o);
    })
    .catch(console.log);
};

//== Update Item
exports.updateItem = async (req, res, next) => {
  const doc = await Item.findOne({ _id: req.params.id });
  if (req.file && req.file.filename) {
    req.body.image = req.file.filename;
    doc.image = req.file.filename;
  }
  if (req.body.title) {
    doc.title = req.body.title;
  }
  if (req.body.text) {
    doc.text = req.body.text;
  }
  if (req.body.order) {
    doc.order = req.body.order;
  }

  await doc.save().then((o) => res.json(o));
};

//== Delete Item
exports.deleteItem = async (req, res, next) => {
  const arr = await Item.deleteOne({ _id: req.params.id })
    .then((_) => {
      res.json(_);
    })
    .catch(console.log);
};

//== Reorder
exports.orderItems = async (req, res, next) => {
  const list = req.body;
  await list.forEach((item) => {
    const resp = Item.updateOne({ _id: item.id }, { order: item.order }).catch(
      console.log
    );
  });
};
