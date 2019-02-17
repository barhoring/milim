const express = require('express');
const router = express.Router();

router.get('/', function (req, res) {
    const name = req.cookies.username;
    if(!name)
        res.redirect('/hello');
    res.render('index', {name});
});

router.get('/hello', function (req, res) {
    const name = req.cookies.username;
    if(name)
        return res.redirect('/');
    res.render('hello');
});


router.post('/hello', function (req, res) {
    res.cookie('username', req.body.username);
    res.redirect('/');
    
});

router.post('/goodbye', function(req, res){
    res.clearCookie('username');
    res.redirect('/hello');
});


//module.exports = router;
module.exports = router;