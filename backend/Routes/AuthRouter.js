const { signup } = require('../Controller/AuthController');
const { signupValidation } = require('../Middlewares/AuthValidation');
const { login } = require('../Controller/AuthController');
const { loginValidation } = require('../Middlewares/AuthValidation');

const router = require('express').Router();


router.post('/login', loginValidation, login);
router.post('/signup',signupValidation,signup);


module.exports = router;
