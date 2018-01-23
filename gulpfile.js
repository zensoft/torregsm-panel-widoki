var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var zip = require('gulp-zip');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var nunjucks = require('gulp-nunjucks');
var fs = require('fs');
var rename = require("gulp-rename");
var argv = require('yargs').argv;

gulp.task("run-server", function(){
  browserSync.init({
      server: "./",
      open: false
  });
});

// Static Server + watching scss/html files
gulp.task('serve', ['sass', 'copy-fonts', 'copy-js', "build-html"], function() {

    browserSync.init({
        server: "./",
        open: false
    });

    gulp.watch("scss/*.scss", ['sass']);
    gulp.watch("templates/*.html", ['build-html']);
    gulp.watch("templates/components/*.html", ['build-html']);
});

function getIndexData() {
  var indexData = {};
  var files = [];
  fs.readdirSync("./templates").forEach(file => {
    if ("index.html" !== file && "base.html" !== file && "components" !== file) {
      files.push({
        name: file,
        link: "/html/" + file
      })
    }
  })
  indexData.files = files;
  return indexData;
}

function getMainPageData() {
  var data =  [
    {
      name: "Dżeilkejs",
      brand: "Samsung",
      model: "S6",
      color: "Limonka",
      qty: 3,
      category: "Backase"
    },
    {
      name: "Dżeilkejs",
      brand: "IPhone",
      model: "6",
      color: "Zielony",
      qty: 7,
      category: "Backase"
    },
    {
      name: "Ładowarka",
      brand: "Samsung",
      model: "S6",
      color: "Czarny",
      qty: 13,
      category: "Ładowarki"
    },
    {
      name: "Ładowarka",
      brand: "Iphone",
      model: "S6",
      color: "Czarny",
      qty: 14,
      category: "Ładowarki"
    }

  ];
  return {
    products: data
  }
}

function getViewsArgs() {
  var data = {};
  data.indexData = getIndexData();
  data.mainPageData = getMainPageData();
  return data;
}

// Compile nunjucks views
gulp.task("build-html", function () {
  return gulp.src('templates/*.html')
        .pipe(nunjucks.compile(getViewsArgs()))
        .pipe(gulp.dest('html'))
        .pipe(browserSync.stream());
});

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
    var style = (argv.prod === undefined) ? 'compact' : 'compressed';
    return gulp.src("scss/*.scss")

        .pipe(sourcemaps.init())

        .pipe(sass({
            outputStyle: style, // nested,compact,expanded,compressed
        }).on('error', sass.logError))

        .pipe(autoprefixer({
            browsers: ['last 2 versions', 'ie >= 9', 'Android >= 2.3', 'Firefox >= 14']
        }))

        .pipe(sourcemaps.write('.'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest("./dist/css"))
        .pipe(browserSync.stream());
});

gulp.task('copy-fonts', function() {
    gulp.src('./bower_components/font-awesome/fonts/**/*')
        .pipe(gulp.dest('./dist/fonts'));
    gulp.src('./bower_components/glyphicons/fonts/**/*')
        .pipe(gulp.dest('./dist/fonts'));
});

gulp.task('copy-js', function() {
    gulp.src([
            './bower_components/jquery/dist/jquery.min.js',
            './bower_components/jquery/dist/jquery.slim.min.js',
            './bower_components/bootstrap/dist/js/bootstrap.min.js',
            './bower_components/tether/dist/js/tether.min.js'
        ])
        .pipe(gulp.dest('./dist/js'));
});

//Watch For changes
gulp.task('watch', ['serve']);
