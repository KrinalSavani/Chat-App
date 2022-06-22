const moment = require("moment");

function formatemsg(username,text){
    return{
        username,
        text,
        time : moment().format('h:mm a')
    }
}
module.exports = formatemsg;