var express = require('express');
var fs = require('fs');
var path = require('path');
var XLSX = require('xlsx');
var router = express.Router();
var { makeName,fillExcel } = require('../functions');
//SELECTS
/*
Van en BIENES: 1,4,5,6,9,10,
Van en SERVICIOS:
*/

// {
//     period : '202009',
//     clientRnc : '132094123',
//     invoices : [
//         {
//             rnc : '00300011038',
//             ncf : 'B0123456789',
//             invoiceType : 2,
//             date : '2020/09/25',
//             payAmount: 25878.25,
//             itbis : 4658.09,
//             invoicePaymentType : 2 
//         }
//     ]
// }

router.post('/fill',(req,res)=>{
    try {
        console.log(req.body);
        req.body = req.body;
        var codeName = makeName(7),
            workbookRoute = path.resolve((__dirname+`../../../public/filled_606/${codeName}.xls`));
        fs.copyFile( './config/606.xls', workbookRoute, (err) => {
            if (err) throw err;
            return true;
        });

        var response = fillExcel(workbookRoute,req.body) ;
        res.json({ 
            result : response ? 1 : 2,
            message : response ? 'Form Filled!' : 'Failure on filling :(',
            codeName : response ? codeName : null
        });

    } catch (error) {
        res.json({error:error}) ;
      }
});

router.get('/file/:codeName', (req,res,next)=>{

    try {
        let codeName = req.params.codeName;
        workbookRoute = path.resolve((__dirname+`../../../public/filled_606/${codeName}.xls`));
        if (!fs.existsSync(workbookRoute)) {
            return next('FILE NOT FOUND');
        }
        res.sendFile(workbookRoute,(err) => {
            console.log(err);
        });
      } catch(err) {
        res.json(err)
      }

       
})
  module.exports = router;