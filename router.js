const {Router} = require("express")
const router = Router();
const path = require("path")
const settings = require("./settings.json")

router.get("/",(req,res)=>{
    if(req.headers["user-agent"].includes("Nintendo WiiU") || settings.debug){
        return res.sendFile(path.join(__dirname,"/views/index.html"))
    }else{
        return res.sendFile(path.join(__dirname,"/views/pcIndex.html"))
    }
})
router.get("/media.js",(req,res)=> res.sendFile(path.join(__dirname,"/files.js")))

module.exports = {router}