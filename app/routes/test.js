var express = require('express');
var router = express.Router();


router.post('/',async (req,res)=>{
    try {
        res.json(req.body.a)
    } catch (error) {
        throw error;
    }
});


module.exports = router;

