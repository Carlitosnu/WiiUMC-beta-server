const colors = require("colors")
const getDate = () => {
    return Date().toString().split(" ")[4]
}
const sucess = (Message) => {
    console.log(`[${getDate()}] - ${colors.blue("SUCESS")} - ${colors.green(Message)}`)
}

module.exports = {
    sucess
}