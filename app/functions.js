var modules = {};
var fs = require('fs');

var tipoCompra = {
    1: '01-GASTOS DE PERSONAL ',
    2: '02-GASTOS POR TRABAJOS, SUMINISTROS Y SERVICIOS ',
    3: '03-ARRENDAMIENTOS ',
    4: '04-GASTOS DE ACTIVOS FIJO ',
    5: '05 -GASTOS DE REPRESENTACIÓN ',
    6: '06 -OTRAS DEDUCCIONES ADMITIDAS ',
    7: '07 -GASTOS FINANCIEROS ',
    8: '08 -GASTOS EXTRAORDINARIOS ',
    9: '09 -COMPRAS Y GASTOS QUE FORMARAN PARTE DEL COSTO DE VENTA ',
    10: '10 -ADQUISICIONES DE ACTIVOS ',
    11: '11- GASTOS DE SEGUROS'
  };
  var tipoPago = {
    1:'01 - EFECTIVO',
    2:'02 - CHEQUES/TRANSFERENCIAS/DEPÓSITO',
    3:'03 - TARJETA CRÉDITO/DÉBITO',
    4:'04 - COMPRA A CREDITO',
    5:'05 -  PERMUTA',
    6:'06 - NOTA DE CREDITO',
    7:'07 - MIXTO'
  }

  var rangoServicios = [2,3,7,8,11];

modules.fillExcel = function (file,data) {
    require('winax');
    var Excel = new ActiveXObject("Excel.Application");
    var test =Excel.Workbooks.Open(file);

    try {
        Excel.DisplayAlerts = false;
        test.ActiveSheet.Range('C4').Value = data.rnc_cliente;
        test.ActiveSheet.Range('C5').Value = data.periodo;
        test.ActiveSheet.Range('C6').Value = data.facturas.length;
        Excel.Run("Formato606.validacion_global");
        Excel.Run("liberarFilas");
        Excel.Run("establecerValoresPorDefecto");
        data.facturas.forEach((factura,linea) => {
            //RNC
            test.ActiveSheet.Range(`B${linea+12}`).Value = factura.rnc;
            //TIPO DE COMPRA
            test.ActiveSheet.Range(`D${linea+12}`).Value = tipoCompra[factura.tipoCompra];
            //NCF
            test.ActiveSheet.Range(`E${linea+12}`).Value = factura.ncf;
            //NCF MODIFICADO EN CASO DE QUE EXISTA
            if (typeof factura.ncfMod !== 'undefined') {
                test.ActiveSheet.Range(`F${linea+12}`).Value = factura.ncfMod;
            }
            //FECHA
            let fecha = factura.fecha.split(new RegExp('/|\\|-'));
            test.ActiveSheet.Range(`G${linea+12}`).Value = data.periodo;
            test.ActiveSheet.Range(`H${linea+12}`).Value = fecha[0] > 31 ? fecha[2] : fecha[0];
            //MONTOS
                //TOTAL BRUTO Y MONTO TOTAL
                test.ActiveSheet.Range(`${rangoServicios.includes(factura.tipoCompra) ? 'K' : 'L'}${linea+12}`).Value = factura.totalBruto;
                //ITBIS
                test.ActiveSheet.Range(`N${linea+12}`).Value = factura.itbis;
            //TIPO DE PAGO
            test.ActiveSheet.Range(`Z${linea+12}`).Value = tipoPago[factura.tipoPago];  
        })
        //VALIDAR, GUARDAR Y CERRAR
        Excel.Run("Formato606.validacion_global");
        Excel.Run("liberarFilas");
        Excel.Run("establecerValoresPorDefecto");
        test.SaveAs(file);
        Excel.Application.Quit();
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}

modules.makeName = function (length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    var files = fs.readdirSync('./public/filled_606');
    files.forEach((file)=>{
        file =file.split('.').shift();
        if(file == result)
            return makeName(length);
    })
    return result;
 }

module.exports = modules;

