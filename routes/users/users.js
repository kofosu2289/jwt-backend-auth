var express = require('express');
var router = express.Router();

var userController = require('./controller/userController');

const validateRegisterInput = require('../utils/validation/register'); 

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/createuser', function(req, res, next) {

  const { errors, isValid } = validateRegisterInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  } else {
    userController.register(req.body)
    .then(user => res.json(user))
    .catch(err => res.json(err));
  }
})

module.exports = router;
