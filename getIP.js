const express =  require("express")
const { existsSync, readFileSync } = require("fs")
const path = require("path")

/**
 * 
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @param {express.NextFunction} next 
 */
const langFiles = (req,res,next) => {
    const lang = req.headers["accept-language"].split("-")[0]
    const fPath = path.resolve(__dirname + `/lang/${lang}.json`);
    if(existsSync(fPath)){
        req.lang = JSON.parse(readFileSync(fPath,{encoding:"utf-8"}));
        next();
    }
    else{
        req.lang = JSON.parse(readFileSync(path.resolve(__dirname, "lang/en.json")));
        next()
    }
}

module.exports = {
    langFiles
}