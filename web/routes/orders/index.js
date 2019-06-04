const express = require('express');

let router = express.Router();

router.post('/', require('./createOrder.js'));
router.patch('/:id', require('./takeOrder.js'));
router.get('/', require('./list.js'));

module.exports = router;