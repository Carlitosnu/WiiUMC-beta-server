const {Router} = require("express");
const { writeFileSync } = require("fs");
const router = Router();
const path = require("path");
const { getFolderFiles, files, removeFile } = require("./files");
const settings = require("./settings.json")

router.get("/",(req,res)=>{
    if(req.headers["user-agent"].includes("Nintendo WiiU") || settings.debug){
        return res.sendFile(path.join(__dirname,"/views/index.html"))
    }else{
        return res.sendFile(path.join(__dirname,"/views/pcIndex.html"))
    }
})
router.get("/admin/files",(req,res)=>{
    if(req.headers["user-agent"].includes("Nintendo WiiU")){
        return res.send("Sorry this route is only for PC & other devices!!")
    }else{
        return res.sendFile(path.join(__dirname,"/views/files.html"))
    }
})
router.delete("/api/admin/video",(req,res) => {
    console.log(req.body);
    removeFile(req.body.fileID);
    return res.json({
        ubication: __dirname + "/public/videos",
        files: files()
    })
})
router.post("/api/admin/video",(req,res)=>{
    const file = req.files.file;

    if(!file.name.endsWith(".mp4") && !file.name.endsWith(".jpg")){
        return res.status(400).send("Sorry only MP4 files supported");
    }

    writeFileSync(path.join(__dirname,"/public/videos/"+file.name),file.data,{encoding: "utf-8"});

    return res.json({
        ubication: __dirname + "/public/videos",
        files: files()
    })
})
// Route for WiiU
router.get("/media.js",(req,res)=>{
    return res.send (`
        const movies = ${JSON.stringify(files())}
    `)
})

// Route for PC.
router.get("/api/media",(req,res)=>{
    return res.json({
        ubication: __dirname + "/public/videos",
        files: files()
    })
})
module.exports = {router}