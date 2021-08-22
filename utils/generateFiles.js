const {argv} = process;
const fs = require("fs")
const path = require("path")

const ip = require("ip").address()
    console.log(`
    _       _  _  _  _     _   __   __     ___   
   (_)  _  (_)(_)(_)(_)   (_) (__)_(__)  _(___)_ 
   (_) (_) (_) _  _ (_)   (_)(_) (_) (_)(_)   (_)
   (_) (_) (_)(_)(_)(_)   (_)(_) (_) (_)(_)    _ 
   (_)_(_)_(_)(_)(_)(_)___(_)(_)     (_)(_)___(_)
    (__) (__) (_)(_) (_____) (_)     (_)  (___)  
    
    WiiUMC Beta 1 - © CarlosThePro
    Create Patch Files Tool - Link for ${ip} IP
`);


const HtmlFile = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Preloader</title>
        <style>
            *{
                margin: 0;
                padding: 0;
            }
            body{
                margin-top: 15%;
                background-color: #FF3D00;
                color: #fff;
                text-align: center;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            }

            h1{
                font-size: 70px;
            }
        </style>
    </head>
    <body>
        <h1>WiiUMC</h1>
        <p>Beta Test</p>

        <script>
            window.location.replace("http://${ip}:3000")
        </script>
    </body>
    </html>
`
const resultFolder = __dirname + "/patch"
fs.writeFileSync(resultFolder + "/index.html",HtmlFile,{encoding: "utf-8"})
fs.writeFileSync(resultFolder + "/index-mobile.html",HtmlFile,{encoding: "utf-8"})
fs.writeFileSync(resultFolder + "/touch.html",HtmlFile,{encoding: "utf-8"})
fs.writeFileSync(resultFolder + "/touch2.html",HtmlFile,{encoding: "utf-8"})
console.log("Files Ready for install!");