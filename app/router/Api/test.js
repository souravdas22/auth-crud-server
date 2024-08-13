const a = "soruav"
const express = require('express');
const testRoute = express.Router()

testRoute.get('/test', (req, res) => {
    res.json({ status: 200, message: "this is test" })
    
})
module.exports = testRoute;