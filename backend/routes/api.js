const path = require('path');
const express = require('express');
const adminController = require('../controllers/admin');
const router = express.Router();


//router.post('/items', adminController.postAddPreDip);
router.get('/items', adminController.getItems);
router.post('/items', adminController.saveItem);
router.delete('/items/:id', adminController.deleteItem);
router.put('/items/order', adminController.orderItems);
router.put('/items/:id', adminController.updateItem);




module.exports = router;
