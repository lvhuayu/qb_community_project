//进行图片格式判断
function checkFileExt(ext, allow = true, rule = 'png|jpeg|bmp|svg|jpg|gif|JPG|JPEG') {
    if (!ext) return false; //如果没有文件直接返回错误
    if (allow) return rule.includes(ext); //.includes检查数组是否包含字段
    return !rule.includes(ext); //如果数组没有包含图片格式文件，返回错误
};

function fileFilter(req, file, cb) {
    let ext = file.originalname.split('.'); //通过.split函数将后缀名与文件名分离，以便判断
    ext = ext[ext.length - 1] //取出文件后缀名
        // 检查文件后缀是否符合规则
    if (checkFileExt(ext, true)) {
        cb(null, true);
    } else {
        // 不符合规则，拒绝文件并且直接抛出错误
        cb(null, false);
        cb(new Error('文件类型错误'));
    }
};
module.exports = {
    checkFileExt,
    fileFilter
};