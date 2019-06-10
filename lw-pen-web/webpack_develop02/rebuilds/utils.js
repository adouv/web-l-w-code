'use strict'
const path = require('path')
const fs = require('fs');
const config = require('../config')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const packageConfig = require('../package.json')
const glob = require('glob');
/** 
 * Generate entries
 */
exports.getEntryJs = function (globPath) {

  globPath = path.resolve(__dirname, globPath);
  let entries = {};

  entries['app'] = "./src/main.js";

  glob.sync(globPath).forEach(function (item) {
    let baseName = path.basename(item, path.extname(item));
    let pathName = path.dirname(item);
    let paths = pathName.split('/');
    let fileDir = paths.splice(paths.indexOf('src') + 1).join('/');

    if (pathName.indexOf('modules') > -1) {
      entries[fileDir.split('/')[1]] = `./src/${fileDir}/${baseName}.js`;
    }
  });

  return entries;
}
exports.getEntryHtml = function (globPath) {

  globPath = path.resolve(__dirname, globPath);

  let entries = [];

  glob.sync(globPath).forEach(function (item) {
    let baseName = path.basename(item, path.extname(item));
    let pathName = path.dirname(item);
    let paths = pathName.split('/');

    // @see https://github.com/kangax/html-minifier#options-quick-reference
    let minifyConfig = process.env.NODE_ENV === 'production' ? {
      // removeComments: true,
      // collapseWhitespace: true,
      // removeAttributeQuotes: true,
      minifyCSS: true,
      minifyJS: true
    } : "";

    // only handle html under the modules folder
    if (item.indexOf('modules') > -1) {
      let chunkName = paths.splice(paths.indexOf('src') + 1).join('/') + '/' + baseName;

      let chunks;
      if (process.env.NODE_ENV === 'production') {
        chunks = ['manifest', 'vendor', 'app', chunkName.split('/')[chunkName.split('/').length - 2]];
      } else {
        chunks = ['app', chunkName.split('/')[chunkName.split('/').length - 2]];
      }

      entries.push({
        filename: chunkName + '.html',
        template: 'index.html',
        chunks: chunks,
        minify: minifyConfig
      });
    }
  });

  // save the entry file to json
  //this.entry2JsonFile(entries);

  return entries;
}
/** 
 * 
 */
exports.entry2JsonFile = function (entries) {
  // let json = {};

  // if (entries) {
  //   entries.forEach(v => {
  //     json[v.filename] = v.filename;
  //   });
  // }

  // 同步写入文件
  let fd = fs.openSync(path.resolve(__dirname, '../src/entry.json'), 'w');
  fs.writeSync(fd, JSON.stringify(entries), 0, 'utf-8');
  fs.closeSync(fd);
}
/** 
 * 
 */
exports.assetsPath = function (_path) {
  const assetsSubDirectory = process.env.NODE_ENV === 'production' ?
    config.build.assetsSubDirectory :
    config.dev.assetsSubDirectory

  return path.posix.join(assetsSubDirectory, _path)
}
/** 
 * 
 */
exports.cssLoaders = function (options) {
  options = options || {}

  const cssLoader = {
    loader: 'css-loader',
    options: {
      sourceMap: options.sourceMap
    }
  }

  const postcssLoader = {
    loader: 'postcss-loader',
    options: {
      sourceMap: options.sourceMap
    }
  }
  /** 
   * generate loader string to be used with extract text plugin
   */
  function generateLoaders(loader, loaderOptions) {
    const loaders = options.usePostCSS ? [cssLoader, postcssLoader] : [cssLoader]

    if (loader) {
      loaders.push({
        loader: loader + '-loader',
        options: Object.assign({}, loaderOptions, {
          sourceMap: options.sourceMap
        })
      })
    }

    // Extract CSS when that option is specified
    // (which is the case during production build)
    if (options.extract) {
      return ExtractTextPlugin.extract({
        use: loaders,
        fallback: 'vue-style-loader'
      })
    } else {
      return ['vue-style-loader'].concat(loaders)
    }
  }

  // https://vue-loader.vuejs.org/en/configurations/extract-css.html
  return {
    css: generateLoaders(),
    postcss: generateLoaders(),
    //less: generateLoaders('less'),
    less: generateLoaders('less', {
      modifyVars: {
        'primary-color': '#ff7d55',
        'link-color': '#ff7d55',
        'border-color-base': '#ff7d55',
        'border-radius-base': '2px',
      },
      javascriptEnabled: true,
    }),
    sass: generateLoaders('sass', {
      indentedSyntax: true
    }),
    scss: generateLoaders('sass'),
    stylus: generateLoaders('stylus'),
    styl: generateLoaders('stylus')
  }
}
/** 
 * Generate loaders for standalone style files (outside of .vue)
 */
exports.styleLoaders = function (options) {
  const output = []
  const loaders = exports.cssLoaders(options)

  for (const extension in loaders) {
    const loader = loaders[extension]
    output.push({
      test: new RegExp('\\.' + extension + '$'),
      use: loader
    })
  }

  return output
}
/** 
 * 
 */
exports.createNotifierCallback = () => {
  const notifier = require('node-notifier')

  return (severity, errors) => {
    if (severity !== 'error') return

    const error = errors[0]
    const filename = error.file && error.file.split('!').pop()

    notifier.notify({
      title: packageConfig.name,
      message: severity + ': ' + error.name,
      subtitle: filename || '',
      icon: path.join(__dirname, 'logo.png')
    })
  }
}
