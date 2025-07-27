const e = require('express');
const { ensureAuthenticated } = require('../Middlewares/Auth');


const router = require('express').Router();


router.get('/', ensureAuthenticated, (req, res)=> {
    console.log('----logged in user details----',req.user);
    res.status(200).json([
        {
            name: 'laptop',
            price: 50000,
        },
        {
            name: 'tablet',
            price: 20000,
        },
        {
            name: 'desktop',
            price: 80000,
        },
        {
            name: 'smartphone',
            price: 30000,
        },
    ]);
});


module.exports = router;
