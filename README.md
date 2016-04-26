This is all you need to know:

* Webpack reads an entry point, walks the dependency graph and outputs a bundle.
* It uses loaders to read files, we use babel to transpile JSX + ES6.
* "publicPath" - if using multiple files, webpack can load them in async. But needs to know where we host those files and uses this config to know that.
* webpack-dev-server does not need any config as such. Just read https://webpack.github.io/docs/webpack-dev-server.html carefully.

## Development

```
$ npm start
# Open http://localhost:8080 in browser and hack away.
```

## Production :

To compile your bundle into dist/ directory,

```
./build # Or "npm run buil"
```

