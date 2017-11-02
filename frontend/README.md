# Real Engine -- Frontend


## Prerequisites

Make sure you have [npm](https://npmjs.com), the node.js package manager.

## Build

Install the dependencies.

```sh
$ npm install
```

Then build the frontend

```sh
$ npm run build
```

which will create the `dist/bundle.js` file.

# JavaScript modules

This project uses multiple javascript modules.
Currently no browsers support javascript modules, so we bundle the modules together into a single `bundle.js` file using [webpack](https://webpack.js.org/).

# Vue

To make development easier, we're using [Vue.js](https://vuejs.org/) to build the frontend.
