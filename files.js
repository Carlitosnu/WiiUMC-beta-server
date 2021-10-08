const uuid = require("uuid").v4;
const ffmpeg = require("fluent-ffmpeg")
function flatten(array)
{
    if(array.length == 0)
        return array;
    else if(Array.isArray(array[0]))
        return flatten(array[0]).concat(flatten(array.slice(1)));
    else
        return [array[0]].concat(flatten(array.slice(1)));
}
const fs = require("fs");
const path = require("path")
const parser = require("iptv-playlist-parser")
let files = []
let tv = []
const f = path.resolve(__dirname + "/public/videos")
const th_dir = path.join(__dirname,"/public/thumb")

if(!fs.existsSync(f)){
    fs.mkdirSync(f,0744)
}

if(!fs.existsSync(th_dir)){
    fs.mkdirSync(th_dir);
}

let thumbs = fs.readdirSync(th_dir,{encoding: "utf-8"});

const getFolderFiles = () => {
    let fls = fs.readdirSync(f,{
        encoding: "utf-8"
    })

    console.log(thumbs);
    const dirs = []

    fls.forEach(async e=>{
        let id = uuid()
        if(!thumbs.find(i => i === e.replace(".mp4",".png")) && e.endsWith(".mp4")){
            await ffmpeg({source: f + "/" + e})
            .takeScreenshots({
                filename: e.replace(".mp4",""),
                timemarks: [3]
            },th_dir)
            
        }
        if(e.endsWith(".mp4")){
            dirs.push({
                name: e.replace(".mp4",""),
                type: "mp4",
                thumb: "/thumb/"+ thumbs.find(i => i === e.replace(".mp4", ".png") ),
                ubication:`/videos/${e}`,
                id
            })
        }else if(e.endsWith(".ogg")){
            dirs.push({
                name: e.replace(".ogg",""),
                type: "ogg",
                ubication:`/videos/${e}`,
                id
            })
        }
    })

    files = dirs;
}

fs.watch(f,{encoding: "utf-8"},() => getFolderFiles());
fs.watch(f + "/m3u",{encoding: "utf-8"},() => m3uParser());
fs.watch(th_dir, ()=> thumbs = fs.readdirSync(th_dir,{encoding: "utf-8"}))

console.log(files);

const removeFile = async(fileID) => {
    fileID = String(fileID)
    const fileToRemove = files.find(e=>e.id===fileID);
    if(!fileToRemove) return
    const pth = path.join(__dirname,"/public" + fileToRemove.ubication)
    await fs.unlinkSync(pth)
    files = files.filter(e=>e.id !== fileID);
}

const m3uParser = () => {
    if(!fs.existsSync(f + "/m3u")) return;
    const dir = fs.readdirSync(f + "/m3u",{encoding: "utf-8"})
    dir.forEach(e=>{
        if(!e.endsWith(".m3u")) return;
        tv.push(parser.parse(fs.readFileSync(f + "/m3u/"+e, {
            encoding: "utf-8"
        })).items)
    })
    tv = flatten(tv)
}
m3uParser()
getFolderFiles()
module.exports = {
    getFolderFiles,
    files: (()=>files),
    removeFile,
    m3uParser: (()=>tv)
}
