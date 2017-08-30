'use strict';

import gulp     from 'gulp';
import webpack  from 'webpack';
import path     from 'path';
import sync     from 'run-sequence';
import rename   from 'gulp-rename';
import template from 'gulp-template';
import fs       from 'fs';
import yargs    from 'yargs';
import lodash   from 'lodash';
import gutil    from 'gulp-util';
import serve    from 'browser-sync';
import webpackDevMiddelware from 'webpack-dev-middleware';
import webpachHotMiddelware from 'webpack-hot-middleware';
import colorsSupported      from 'supports-color';
import historyApiFallback   from 'connect-history-api-fallback';

let root = 'client';

// helper method for resolving paths
let resolveToApp = (glob = '') => {
  return path.join(root, 'app', glob); // app/{glob}
};

let resolveToComponents = (glob = '') => {
  return path.join(root, 'app/components', glob); // app/components/{glob}
};

let resolveToReducers = (glob = '') => {
  return path.join(root, 'app/reducers', glob); // app/reducers/{glob}
};

let resolveToActions = (glob = '') => {
  return path.join(root, 'app/actions', glob); // app/actions/{glob}
};

// map of all paths
let paths = {
  js: resolveToComponents('**/*!(.spec.js).js'), // exclude spec files
  scss: resolveToApp('**/*.scss'), // stylesheets
  html: [
    resolveToApp('**/*.html'),
    path.join(root, 'index.html')
  ],
  entry: path.join(__dirname, root, 'app/app.js'),
  output: root,
  componentTemplate: path.join(__dirname, 'generator', 'component/**/*.**'),
  reducerTemplate: path.join(__dirname, 'generator', 'reducer/**/*.**'),
  actionTemplate: path.join(__dirname, 'generator', 'action/**/*.**')
};

// use webpack.config.js to build modules
gulp.task('webpack', (cb) => {
  const config = require('./webpack.dist.config');
  config.entry = {app : paths.entry};

  webpack(config, (err, stats) => {
    if(err)  {
      throw new gutil.PluginError("webpack", err);
    }

    gutil.log("[webpack]", stats.toString({
      colors: colorsSupported,
      chunks: false,
      errorDetails: true
    }));

    cb();
  });
});

gulp.task('serve', () => {
  const config = require('./webpack.dev.config');
  config.entry= {app : [
    // this modules required to make HRM working
    // it responsible for all this webpack magic
    'webpack-hot-middleware/client?reload=true',
    // application entry point
    paths.entry
  ]};

  var compiler = webpack(config);

  serve({
    port: process.env.PORT || 3000,
    open: false,
    server: {baseDir: root},
    middleware: [
      historyApiFallback(),
      webpackDevMiddelware(compiler, {
        stats: {
          colors: colorsSupported,
          chunks: false,
          modules: false
        },
        publicPath: config.output.publicPath
      }),
      webpachHotMiddelware(compiler)
    ]
  });
});

gulp.task('watch', ['serve']);

gulp.task('component', () => {
  const cap = (val) => {
    return val.charAt(0).toUpperCase() + val.slice(1);
  };
  const name = yargs.argv.name;
  const parentPath = yargs.argv.parent || '';
  const destPath = path.join(resolveToComponents(), parentPath, name);

  return gulp.src(paths.componentTemplate)
    .pipe(template({
      name: name,
      upCaseName: cap(name)
    }))
    .pipe(rename((path) => {
      path.basename = path.basename.replace('temp', name);
    }))
    .pipe(gulp.dest(destPath));
});

gulp.task('reducer', () => {
  const cap = (val) => {
    return val.charAt(0).toUpperCase() + val.toLowerCase().slice(1);
  };

  const mayus = (val) => {
    return val.toUpperCase()
  };

  const func = (val) => {
    let splited = val.split("_");
    let a = splited.shift().toLowerCase();
    splited.forEach(function(spli){
       a = a + cap(spli);
    });
    return a;
  };

  const act = (array) => {
    let actObject = [];
    array.forEach(function(val){
      actObject.push({name: val, nameF: func(val)})
    });
    return actObject;
  };

  const name = yargs.argv.name;
  let actions = []
  actions = yargs.argv.actions;
  const parentPath = yargs.argv.parent || '';
  let destPath = path.join(resolveToReducers(), parentPath, name);

  console.log("Reducer: "+ name);
  console.log("Acciones a crear: "+ actions);

  console.log("Creando reducer");

  gulp.src(paths.reducerTemplate)
    .pipe(template({
      name: name,
      nameC: cap(name),
      nameM: mayus(name),
      actions: act(actions)
    }))
    .pipe(rename((path) => {
      path.basename = path.basename.replace('temp', name);
    }))
    .pipe(gulp.dest(destPath));

  console.log("Creando actions");

  destPath = path.join(resolveToActions(), '', name)

  gulp.src(paths.actionTemplate)
    .pipe(template({
      name: name,
      nameC: cap(name),
      nameM: mayus(name),
      nameF: func(name),
      actions: act(actions)
    }))
    .pipe(rename((path) => {
      path.basename = path.basename.replace('temp', name);
    }))
    .pipe(gulp.dest(destPath));

  return true;
});

gulp.task('default', ['serve']);


