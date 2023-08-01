const path = require('path')
function resolve (dir){
    return path.join(__dirname,dir)   //path.join(__dirname) 设置绝对路径 双下划线
}

module.expots = {
    //...
    chainWepack :(config) => {
        config.resolve.alias
            .set('@', resolve('src'))
            .set('views',resolve('./src/view'))
            .set('assets',resolve('./src/assets'))
            //...可以继续自定义别名
             //set 第一个参数：设置的别名；第二个参数：原来默认的路径
    }
    //...
}