
// function beautify_time(timestamp) {
//     var mistiming = Math.round(new Date() / 1000) - timestamp;
//     var postfix = mistiming > 0 ? '前' : '后'
//     mistiming = Math.abs(mistiming)
//     var arrr = ['年', '个月', '星期', '天', '小时', '分钟', '秒'];
//     var arrn = [31536000, 2592000, 604800, 86400, 3600, 60, 1];

//     for (var i = 0; i < 7; i++) {
//         var inm = Math.floor(mistiming / arrn[i])
//         if (inm != 0) {
//             return inm + arrr[i] + postfix
//         }
//     }
// }


function timeFormat(timestamp) {
    var mistiming = Math.round((Date.now() - timestamp) / 1000);
    var arrr = ['年', '个月', '星期', '天', '小时', '分钟', '秒'];
    var arrn = [31536000, 2592000, 604800, 86400, 3600, 60, 1];
    for (var i = 0; i < arrn.length; i++) {
        var inm = Math.floor(mistiming / arrn[i]);
        if (inm != 0) {
            return inm + arrr[i] + '前';
        }
    }
}

Date.prototype.Format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

let breakword = value => { if (value.length > 20) return value.substr(0, 20) + '...'; else return value }

let formatDate = value => timeFormat(new Date(value).getTime())

let formatTime = value => new Date(value).Format("yyyy-MM-dd")



export {
    formatDate,
    formatTime,
    breakword
}