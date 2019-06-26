const path = require("path");

module.exports = {
    chainWebpack: config => {
        config
        .entry("app")
        .clear()
        .add("./vue/main.js")
        .end();
        config.resolve.alias
        .set("@", path.join(__dirname, "./vue"))
    }
};