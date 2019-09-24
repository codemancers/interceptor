const { src, dest, watch, parallel, series, task } = require("gulp");
const zip = require("gulp-zip");
const replace = require("gulp-replace");
const sequence = require("run-sequence");
const git = require("gulp-git");
const conventionalChangelog = require("gulp-conventional-changelog");
const fs = require("fs");
const signAddon = require("sign-addon").default;

const APP_PATH = "./app/";
const DIST_PATH = "./dist/";
const OUTPUT_PATH = "./web-ext-artifacts/";

function changelog() {
  return src("CHANGELOG.md", {
    buffer: false
  })
    .pipe(
      conventionalChangelog({
        preset: "angular" // Or to any other commit message convention you use.
      })
    )
    .pipe(dest("./"));
}

function commitChanges() {
  return (
    src(["./package.json", "./CHANGELOG.md", "./app/manifest.json"])
      .pipe(git.add())
      // to avoid issue https://github.com/stevelacy/gulp-git/issues/186
      .pipe(
        git.commit(undefined, {
          args: '-m "build: release ' + process.env.NEW_VERSION + '"',
          disableMessageRequirement: true,
          disableAppendPaths: true
        })
      )
      .on("error", function(error) {
        console.log(error);
      })
  );
}

function pushChanges(done) {
  git.push('origin', 'master', done);
  return done();
}

function createNewTag(done) {
  var version = getPackageJsonVersion();
  git.tag(version, version, function(error) {
    if (error) {
      return done(error);
    }
    git.push('origin', 'master', {args: '--tags'}, done);
    return done();
  });

  function getPackageJsonVersion() {
    // We parse the json file instead of using require because require caches
    // multiple calls so the version number won't be updated
    return JSON.parse(fs.readFileSync("./package.json", "utf8")).version;
  }
}

function manifestVersion() {
  return src([DIST_PATH + "manifest.json"])
    .pipe(replace(/(.*"version": ")(.*)(",.*)/g, "$1" + process.env.NEW_VERSION + "$3"))
    .pipe(dest(DIST_PATH));
}

function manifestAppVersion() {
  return src([APP_PATH + "manifest.json"])
    .pipe(replace(/(.*"version": ")(.*)(",.*)/g, "$1" + process.env.NEW_VERSION + "$3"))
    .pipe(dest(APP_PATH));
}

function packageVersion() {
  return src(["./package.json"])
    .pipe(replace(/(.*"version": ")(.*)(",.*)/g, "$1" + process.env.NEW_VERSION + "$3"))
    .pipe(dest("./"));
}

function xpi() {
  const manifest = require(DIST_PATH + "manifest.json");
  const distFileName = manifest.name + "-" + manifest.version + ".xpi";
  return src([DIST_PATH + "/**"])
    .pipe(zip(distFileName))
    .pipe(dest(OUTPUT_PATH));
}

function zipDist() {
  const manifest = require(DIST_PATH + "manifest.json");
  const distFileName = manifest.name + "-" + manifest.version + ".zip";
  return src([DIST_PATH + "/**"])
    .pipe(zip(distFileName))
    .pipe(dest(OUTPUT_PATH));
}

function zipApp() {
  const manifest = require(DIST_PATH + "manifest.json");
  const distFileName = manifest.name + "-app-" + manifest.version + ".zip";
  return src([APP_PATH + "/**"])
    .pipe(zip(distFileName))
    .pipe(dest(OUTPUT_PATH));
}

function sign() {
  const manifest = require(DIST_PATH + "manifest.json");
  const distFileName = manifest.name + "-" + manifest.version + ".xpi";
  signAddon({
    xpiPath: OUTPUT_PATH + distFileName,
    version: manifest.version,
    apiKey: process.env.AMO_API_KEY,
    apiSecret: process.env.AMO_API_SECRET,
    downloadDir: OUTPUT_PATH,
    channel: "listed",
    id: "{024f65fd-47e3-4556-bd93-4c0a1d08cd33}"
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
}

exports.changelog = changelog;
exports.release = series(
  parallel(manifestVersion, manifestAppVersion, packageVersion),
  changelog,
  commitChanges,
  pushChanges,
  createNewTag,
  parallel(xpi, zipDist, zipApp),
  sign
);
