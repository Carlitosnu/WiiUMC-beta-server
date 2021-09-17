const {imgur} = require("../settings.json")
const imgurClient = require("imgur");
const {resolve} = require("path")

imgurClient.setClientId("a321d58ab7123b9")

const upload = async (imgID) => {
    if(imgur.CanUpload){
        try{
            let upload = await imgurClient.uploadFile(resolve(__dirname,"../public/images/screenshots/" + imgID))
            return upload.link;
        }catch(error){
            console.error(error)
        }
    }
}

module.exports = {
    upload
}