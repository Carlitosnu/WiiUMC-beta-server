const express = require("express")
const settings = require("../settings.json");
module.exports = {
    /**
     * @param {express.Request} req
     * @param {express.Response} res
     * @param {express.NextFunction} next
     */
    isWiiU: (req,res,next) => {
        if(req.headers["user-agent"].includes("Nintendo WiiU") || settings.debug) {
            req.isWiiU = true
            next();
        }else{
            req.isWiiU = false;
            next()
        }
    }
}