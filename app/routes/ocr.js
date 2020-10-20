var express = require('express');
var router = express.Router();
const axios = require('axios');
const fs = require('fs');
const util = require('util');
const formData = require('form-data');
const form = new formData();
// form.append("file", fs.createReadStream('./tests/rot.jpg') );
// form.append("filetype


function getFromRegex(regex,string){
        string = string.split('\n');
        var result = [];
        string.forEach(line => {
            var words = line.split('\t');
            words.forEach((element) => {
                var el = element.match(regex);
                if(el !== null) result.push(el[0]);
            })
        });
        return result;
    }

let url = 'https://api.ocr.space/parse/image'
let options = {
    headers : {
      apiKey: '42d2651d1288957',
      ...form.getHeaders()
    }
};

  

router.get('/',(req,res)=>{
  var rnc_client = '132094123';
   var base64image  = req.body.base64image ;
  form.append("base64image",  base64image );
  form.append('scale', 'true');
  form.append('apiKey', '42d2651d1288957');
  form.append('isTable', 'true');
  form.append('OCREngine', '2');
  axios.post(url, form, options)
  .then(function (response) {
    res.header('content-type','application/json')
    let string =response.data.ParsedResults[0].ParsedText;
    console.log('starting decoding');
    var separators = ['/','-'];
    var obj ={}
        obj.NCF = getFromRegex('B([0-9].{9}|O[0-9].{8})',string).map((i) => i.replace('O','0'));
        obj.RNC = getFromRegex('[0-9\-?]+$',string)
        .map((i) => {
          var formated_rnc = i.replace(new RegExp('-', 'g'),'');
          var q = false;
          obj.NCF.forEach((z) => {
            if(z.includes(i))
              q = true;
          })
          if (!q)
            return formated_rnc;
        })
        .filter((value,index, self) => 
        { 
          return value !== undefined && value !== rnc_client && value.length >= 9 && value.length <= 11 && !value.includes('809') && self.indexOf(value) === index
        });

        obj.fecha = getFromRegex('([0-9]*/[0-9]*/[0-9]*|[0-9]*\\-[0-9]*\\-[0-9]*)',string).map((i) => 
        { 
          if( i.split(new RegExp(separators.join('|')))[2] == new Date().getFullYear())
           return i;
          }).filter((value,index, self) => { return value !== undefined && self.indexOf(value) === index;});


        obj.totales = getFromRegex("\\d{1,}(?:\\,?\\d{3})*(?:\\.\\d{2})?%?",string)
        .filter((i,index,self) => { return i !== undefined && !obj.RNC.includes(i) && self.indexOf(i) === index && i != 0  && !i.includes('809') && ( i.includes(',') || i.includes('.') || i.length === 3|| (i.length === 5 && i.includes('.')))})
        .map((i) => { return parseFloat(i.replace(/,/g, ''))})
        .sort((a,b) => { return a < b;});

    res.send(obj);
  })
  .catch(function (error) {
    res.send({Error : error.isAxiosError ? 'Error en la peticion del OCR' : 'Error Interno'})
  });
})



module.exports = router;