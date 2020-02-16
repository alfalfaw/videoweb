//清空对象
function deleteProperties(objectToClean) {
    Object.keys(objectToClean).forEach(function (key) { delete objectToClean[key]; });

}
//重置对象
function resetProperties(oldVal, newVal) {
    //删除旧对象原有属性
    deleteProperties(oldVal)
    //拷贝对象
    Object.keys(newVal).forEach(function (key) { oldVal[key] = newVal[key] });
}
//设置属性
function setProperties(oldVal, newVal) {
    Object.keys(newVal).forEach(function (key) { oldVal[key] = newVal[key] });
}
export { deleteProperties, setProperties, resetProperties }