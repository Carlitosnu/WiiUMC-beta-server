const e = require("express");
const {Router} = require("express");
const { writeFileSync } = require("fs");
const router = Router();
const path = require("path");
const { getDatabase, createConnection } = require("./database");
const { sendImage } = require("./discord/integration");
const { getFolderFiles, files, removeFile,m3uParser } = require("./files");
const { langFiles } = require("./getIP");
const { sucess } = require("./logger");
const settings = require("./settings.json");
const { upload } = require("./utils/imgur");
const {isWiiU} = require("./utils/isWiiU");
createConnection()
function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
   }
   return result;
}

router.get("/",langFiles,isWiiU,(req,res)=>{
    if(req.isWiiU){
        return res.render("index",{
            lang: req.lang,
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

    if(!file.name.endsWith(".mp4") && !file.name.endsWith(".ogg")){
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
    let video;
    if(videoname.endsWith(".mp4")) video = videoname.split(".mp4")[0];
    if(videoname.endsWith(".mkv")) video = videoname.split(".mkv")[0];
    if(videoname.endsWith(".ogg")) video = videoname.split(".ogg")[0];
    console.log(files().find(e=> video === e.name));
    res.render("videos",{
        file: files().find(e=>video.split(".mp4")[0] === e.name)
    })

})

router.get("/api/admin/demomode", isWiiU,(req,res)=>{
    if(req.isWiiU){
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

// Routes for Screenshot service
router.get("/screenshot",isWiiU,langFiles,(req,res)=>{
    if(req.isWiiU){
        res.render("screenshots/wiiu.view.ejs",{
            lang: req.lang
        });
    }else{
        res.render("screenshots/pc.view.ejs",{
            lang: req.lang
        })
    }
})
router.get("/screenshot-recive/:id",(req,res)=>{
    const {id} = req.params
})
router.post("/screenshot",langFiles,async (req,res)=>{
    const {screenshot} = req.files;
    const id = makeid(5);
    const fname = id + "." + screenshot.mimetype.split("/")[1]
    await screenshot.mv(__dirname + "/public/images/screenshots/" + fname,async(e)=> {
        const imgurURL = await upload(fname);
        console.log(imgurURL);
        if(e){
            console.log("An error found in router.js:136")
           return console.log(e)
        }
        getDatabase().get("images").push({
            id,
            path: `/images/screenshots/${id}.png`,
            imgurURL
        }).write()
        
        sendImage(imgurURL)

        res.render("screenshots/wiiu.postit.ejs",{
            lang: req.lang,
            refcode: id
        })
    })

})

router.get("/music",langFiles,(req,res)=>{
    res.render("develop",{
        type: req.lang.nav.music,
        lang: req.lang
    })
})

router.get("/images",langFiles,(req,res)=>{
    res.render("develop",{
        type: req.lang.nav.video,
        lang: req.lang
    })
})

router.get("/api/tv",(req,res)=>[
    res.json({
        list: m3uParser()
    })
])
router.get("/tv/:showid",(req,res)=>{
    const {showid} = req.params;
    const video = m3uParser().find(e=>e.name === showid);

    res.render("tv", {
        video
    });
})

router.get("/tv",langFiles,(req,res)=>{
    res.render("tv.ui.ejs",{
        lang:req.lang,
        tvShows: {
            items: m3uParser()
        }
    })
})

router.get("/tv-search/:query",langFiles,(req,res)=>{
    const query = req.params.query;
    const tvShows = m3uParser();
    
    const results = tvShows.filter(e=>e.name.toLowerCase().includes(query.toLowerCase()));
    res.render("tv.ui.ejs",{
        lang: req.lang,
        tvShows: {
            items: results
        }
    })
})
module.exports = {router}