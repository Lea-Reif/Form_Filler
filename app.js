const { app,port }= require('./app/server');



app.listen(port,(
    console.log(`*************************************************************\n`+
                `Server on port ${port}\n`.padStart(40)+
                `*************************************************************`)
    ));