require('winax');
var express = require('express');
var fs = require('fs');
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
    periodo : '202009',
    rnc_cliente : '132094123',
    facturas : [
        {rnc : '00300011038', ncf : 'B0123456789', tipoCompra : 2, fecha : '2020/09/25', totalBruto: 25878.25, itbis : 4658.09, tipoPago : 2 }
    ]
}

router.get('/',async (req,res)=>{
    try {
        req.body = dummyData;
        var codeName = makeName(7),
            workbookRoute = __dirname+`../../../public/filled_606/${codeName}.xls`;
        fs.copyFile( './config/606.xls', workbookRoute, (err) => {
            if (err) throw err;
            return true;
        });

        var response = fillExcel(workbookRoute,req.body);

        res.json({'code' : response ? 1 : 2});
    } catch (error) {
        throw error;
    }
});

  module.exports = router;