require('winax');
var express = require('express');
var fs = require('fs');
var path = require('path');
var XLSX = require('xlsx');
var router = express.Router();
var Excel = new ActiveXObject("Excel.Application");
var { makeName,fillExcel } = require('../functions');
//SELECTS
/*
Van en BIENES: 1,4,5,6,9,10,
Van en SERVICIOS:
*/

var dummyData ={
    period : '202009',
    clientRnc : '132094123',
    invoices : [
        {
            rnc : '00300011038',
            ncf : 'B0123456789',
            invoiceType : 2,
            date : '2020/09/25',
            payAmount: 25878.25,
            itbis : 4658.09,
            invoicePaymentType : 2 
        }
    ]
}

router.get('/',async (req,res)=>{
    try {
        req.body = req.body || dummyData;
        var codeName = makeName(7),
            workbookRoute = path.resolve((__dirname+`../../../public/filled_606/${codeName}.xls`));
        fs.copyFile( './config/606.xls', workbookRoute, (err) => {
            if (err) throw err;
            return true;
        });

        var response = fillExcel(workbookRoute,req.body);
        res.sendFile(workbookRoute,(err) => {
            // res.send('FORBIDEN');
            console.log(err);
        });
        // res.json({'code' : response ? 1 : 2});
    } catch (error) {
        throw error;
    }
});

  module.exports = router;