const gulp = require("gulp");
const zip = require("gulp-zip");
const replace = require("gulp-replace");
const sequence = require('run-sequence');
const git = require('gulp-git');
var conventionalChangelog = require('gulp-conventional-changelog');
var fs = require('fs');

const APP_PATH = "./app/";
const DIST_PATH = "./dist/";
const OUTPUT_PATH = "./web-ext-artifacts/";

gulp.task('changelog', function () {
  return gulp.src('CHANGELOG.md', {
    buffer: false
  })
    .pipe(conventionalChangelog({
      preset: 'angular' // Or to any other commit message convention you use.
    }))
    .pipe(gulp.dest('./'));
});

gulp.task('commit-changes', function () {
  return gulp.src(['./package.json', './CHANGELOG.md', './app/manifest.json'])
    .pipe(git.add())
    // to avoid issue https://github.com/stevelacy/gulp-git/issues/186
    .pipe(git.commit(undefined, {
      args: '-m "build: release ' + process.env.NEW_VERSION + '"',
      disableMessageRequirement: true,
      disableAppendPaths: true,
    }))
    .on('error',function(error) {
      console.log(error);
    });
});

gulp.task('push-changes', function (done) {
  git.push('origin', 'master', done);
});

gulp.task('create-new-tag', function (done) {
  var version = getPackageJsonVersion();
  git.tag(version, version, function (error) {
    if (error) {
      return done(error);
    }
    git.push('origin', 'master', {args: '--tags'}, done);
  });

  function getPackageJsonVersion () {
    // We parse the json file instead of using require because require caches
    // multiple calls so the version number won't be updated
    return JSON.parse(fs.readFileSync('./package.json', 'utf8')).version;
  };
});

gulp.task("manifest:version", function() {
  return gulp
    .src([DIST_PATH + "manifest.json"])
    .pipe(replace(/(.*"version": ")(.*)(",.*)/g, '$1' + process.env.NEW_VERSION + '$3'))
    .pipe(gulp.dest(DIST_PATH));
});

gulp.task("manifest:version:app", function() {
  return gulp
    .src([APP_PATH + "manifest.json"])
    .pipe(replace(/(.*"version": ")(.*)(",.*)/g, '$1' + process.env.NEW_VERSION + '$3'))
    .pipe(gulp.dest(APP_PATH));
});

gulp.task("package:version", function() {
  return gulp
    .src(["./package.json"])
    .pipe(replace(/(.*"version": ")(.*)(",.*)/g, '$1' + process.env.NEW_VERSION + '$3'))
    .pipe(gulp.dest("./"));
});

gulp.task("xpi", function() {
  const manifest = require(DIST_PATH + "manifest.json");
  const distFileName = manifest.name + "-" + manifest.version + ".xpi";
  return gulp
    .src([DIST_PATH + "/**"])
    .pipe(zip(distFileName))
    .pipe(gulp.dest(OUTPUT_PATH));
});

gulp.task("zip", function() {
  const manifest = require(DIST_PATH + "manifest.json");
  const distFileName = manifest.name + "-" + manifest.version + ".zip";
  return gulp
    .src([DIST_PATH + "/**"])
    .pipe(zip(distFileName))
    .pipe(gulp.dest(OUTPUT_PATH));
});

gulp.task("app:zip", function() {
  const manifest = require(DIST_PATH + "manifest.json");
  const distFileName = manifest.name + "-app-" + manifest.version + ".zip";
  return gulp
    .src([APP_PATH + "/**"])
    .pipe(zip(distFileName))
    .pipe(gulp.dest(OUTPUT_PATH));
});

gulp.task("sign", function() {
  const manifest = require(DIST_PATH + "manifest.json");
  const distFileName = manifest.name + "-" + manifest.version + "signed.xpi";
  signAddon({
    xpiPath: distFileName,
    version: manifest.version,
    apiKey: process.env.AMO_API_KEY,
    apiSecret: process.env.AMO_API_SECRET,
    downloadDir: OUTPUT_PATH,
    channel: 'unlisted'
  })
  .then(function(result) {
    if (result.success) {
      console.log("The following signed files were downloaded:");
      console.log(result.downloadedFiles);
      console.log("Your extension ID is:");
      console.log(result.id);
    } else {
      console.error("Your add-on could not be signed!");
      console.error("Check the console for details.");
    }
    console.log(result.success ? "SUCCESS" : "FAIL");
  })
  .catch(function(error) {
    console.error("Signing error:", error);
  });
});

gulp.task("release:prod", function(done) {
  sequence(
    ["manifest:version", "manifest:version:app", "package:version"],
    "changelog",
    "commit-changes",
    "push-changes",
    "create-new-tag",
    ["xpi", "zip", "app:zip"],
    // "sign",
    done
  );
});
