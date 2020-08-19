var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Jonli Toplar Chati' });
});

router.get('/getInv', function(req, res, next) {
    const envData = require("../cfg/tsconfig.json")[process.env.NODE_ENV || 'development']
    res.json(envData)
});

module.exports = router;
