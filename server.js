const express = require("express")
const morgan = require("morgan");
const { getFolderFiles } = require("./files");
const { sucess } = require("./logger");
const { router } = require("./router");
const fileupload = require("express-fileupload")
const app = express();

const ip = require("ip").address()
app.use(morgan("dev"));

getFolderFiles()
app.use(express.json());
app.use(fileupload())
app.use(express.urlencoded({extended:false}))
let PORT = process.env.PORT || 3000
app.use(express.static(__dirname + '/public'));
app.use("/",router)
app.listen(PORT,()=>{
    console.log(`
    _       _  _  _  _     _   __   __     ___   
   (_)  _  (_)(_)(_)(_)   (_) (__)_(__)  _(___)_ 
   (_) (_) (_) _  _ (_)   (_)(_) (_) (_)(_)   (_)
   (_) (_) (_)(_)(_)(_)   (_)(_) (_) (_)(_)    _ 
   (_)_(_)_(_)(_)(_)(_)___(_)(_)     (_)(_)___(_)
    (__) (__) (_)(_) (_____) (_)     (_)  (___)  
    
    WiiUMC Beta 1 - © CarlosThePro
    `);   

    sucess(`Servidor inciado`)
    sucess("\n-- Para acceder en tu WiiU entra al navegador y ingresa la IP --\n                  --" + ip + ":" + PORT + "--");
    
})