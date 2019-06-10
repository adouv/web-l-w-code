class AssetsHtmlPlugin {

    constructor(options) {
        this.options = options;
    }

    apply(compiler) {
        let paths = this.options.paths;
        compiler.plugin('compilation', (compilation, options) => {
            compilation.plugin('html-webpack-plugin-before-html-processing',
                (htmlPluginData, callback) => {
                    for (let i = paths.length - 1; i >= 0; i--) {
                        htmlPluginData.assets.js.unshift(paths[i]);
                    }
                    callback(null, htmlPluginData);
                });
        });
    }
}

module.exports = AssetsHtmlPlugin;