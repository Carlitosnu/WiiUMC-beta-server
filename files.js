const uuid = require("uuid").v4;
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

if(!fs.existsSync(f)){
    fs.mkdirSync(f,0744)
}

const getFolderFiles = () => {
    let fls = fs.readdirSync(f,{
        encoding: "utf-8"
    })

    const dirs = []
    fls.forEach(e=>{
        let id = uuid()
        if(e.endsWith(".mp4")){
            dirs.push({
                name: e.replace(".mp4",""),
                type: "mp4",
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
        console.log(e);
        tv.push(parser.parse(fs.readFileSync(f + "/m3u/"+e, {
            encoding: "utf-8"
        })).items)
    })
    tv = flatten(tv)
}
m3uParser()
module.exports = {
    getFolderFiles,
    files: (()=>files),
    removeFile,
    m3uParser: (()=>tv)
}
