const express = require('express');
const router = express.Router();
const message = require('../container/message');

module.exports = function () {
    router.ws('/connection', message.Connection)
    return router
}