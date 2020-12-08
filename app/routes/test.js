var express = require('express');
var router = express.Router();
var path = require('path');



router.get('/',async (req,res)=>{
    try {
        res.json(path.join(path.dirname(require.main.filename),`/public/filled_606/${codename}`));
    } catch (error) {
        throw error;
    }
});


module.exports = router;

