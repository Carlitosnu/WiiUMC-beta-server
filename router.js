const {Router} = require("express");
const { writeFileSync } = require("fs");
const router = Router();
const path = require("path");
const { getFolderFiles, files, removeFile } = require("./files");
const { sucess } = require("./logger");
const settings = require("./settings.json")

router.get("/",(req,res)=>{
    if(req.headers["user-agent"].includes("Nintendo WiiU") || settings.debug){
        return res.render("index",{
            videos: files()
        })
    }else{
        return res.render("pcIndex",{
            ip: require("ip").address() + `:${process.env.PORT || settings.port}`
        })
    }
})
router.get("/admin/files",(req,res)=>{
    if(req.headers["user-agent"].includes("Nintendo WiiU")){
        return res.send("Sorry this route is only for PC & other devices!!")
    }else{
        return res.render("files")
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


router.get("/view/:videoname",(req,res)=>{
    const {videoname} = req.params;

    if(!videoname){
        return res.redirect("/");
    }

    res.render("videos",{
        file: files().find(e=>videoname.split(".mp4")[0] === e.name)
    })

})

router.get("/api/admin/demomode",(req,res)=>{
    if(req.headers["user-agent"].includes("Nintendo WiiU")){
        return res.status(400).send("Sorry this action only can be with a pc")
    }
    if(!settings.debug) {
        settings.debug = true;
        sucess("Debuggin mode is active")
        return res.redirect("/admin/files")
    }
    if(settings.debug)  {
        settings.debug = false;
        sucess("Debuggin mode is unactive")
        return res.redirect("/admin/files")
    }
})

// Route for PC.
router.get("/api/media",(req,res)=>{
    return res.json({
        ubication: __dirname + "/public/videos",
        files: files()
    })
})
module.exports = {router}