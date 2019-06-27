const path = require('path')
const config = require('config')

process.env.VUE_APP_SOCKET_PORT = config.get('server.socket_port')

module.exports = {
    devServer: {
        host: config.get('vue.host'),
        port: config.get('vue.port')
    },

    chainWebpack: config => {
        const types = ['vue-modules', 'vue', 'normal-modules', 'normal']
        types.forEach(type => addStyleResource(config.module.rule('less').oneOf(type)))
        
        config.module
            .rule('images')
            .test( /\.(gif|png|jpe?g|svg)$/i)
            .use('file-loader')
                .loader('image-webpack-loader')
                .end()

        config
            .entry('app')
            .clear()
            .add('./vue/main.js')
            .end();

        config.resolve.alias
            .set('@', path.join(__dirname, './vue'))
    }
};

function addStyleResource (rule) {
    rule.use('style-resource')
        .loader('style-resources-loader')
        .options({
        patterns: [
            path.resolve(__dirname, './vue/assets/_styles.less'),
        ],
    })
}