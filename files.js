const uuid = require("uuid").v4;
const fs = require("fs");
const path = require("path")
let files = []
const f = path.resolve(__dirname + "/public/videos")

if(!fs.existsSync(f)){
    fs.mkdirSync(f,0744)
}

const getFolderFiles = () => {
    let fls = fs.readdirSync(f,{
        encoding: "utf-8"
    })
    fls = fls.map(e=>{
        let id = uuid()
        if(e.endsWith(".mp4")){
            return {
                name: e.replace(".mp4",""),
                ubication:`/videos/${e}`,
                id
            }
        }
        return false
    })
    files = fls;
}

fs.watch(f,{encoding: "utf-8"},() => getFolderFiles());
console.log(files);
const removeFile = async(fileID) => {
    fileID = String(fileID)
    const fileToRemove = files.find(e=>e.id===fileID);
    if(!fileToRemove) return
    const pth = path.join(__dirname,"/public" + fileToRemove.ubication)
    await fs.unlinkSync(pth)
    files = files.filter(e=>e.id !== fileID);
} 
module.exports = {
    getFolderFiles,
    files: (()=>files),
    removeFile
}
