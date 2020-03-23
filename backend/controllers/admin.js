
const Item = require('../models/item');
var _ = require('lodash');

//== Get Items
exports.getItems = async(req, res, next) => {
  const arr = await Item.find({}).sort({order:1});
  res.json(arr);
};

//== Save Item
exports.saveItem = (req, res, next) => {

  req.body.image=(req.file)?req.file.filename:'';
  const form = new Item(req.body);
  form
    .save()
    .then(_=>{
      res.json(_);
    })
    .catch(console.log);
};

//== Update Item
exports.updateItem = async(req, res, next) => {
  if(req.file && req.file.filename){
    req.body.image=req.file.filename;
  }
  console.log(req.body);
  const resp = await Item.updateOne({ _id: req.params.id }, req.body)
    .then(_=>{
      res.json(_);
    })
    .catch(console.log);

};

//== Delete Item
exports.deleteItem = async(req, res, next) => {
  const arr = await Item.deleteOne({_id:req.params.id})
  .then(_=>{
    res.json(_);
  })
  .catch(console.log);
};

//== Reorder
exports.orderItems = async(req, res, next) => {
  const list = req.body;
  await list.forEach(item => {
    const resp =  Item.updateOne({ _id: item.id }, {order:item.order})
    .catch(console.log);
  });

};