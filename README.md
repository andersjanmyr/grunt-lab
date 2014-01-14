# Grunt Lab

Grunt lab is an introductory lab for Grunt.js.

## Prerequisites

* A working installation of Node.js, [http://nodejs.org/](http://nodejs.org/)

## Installation

```
$ git clone https://github.com/andersjanmyr/grunt-lab.git`
$ cd grunt-lab
$ npm install
$ bower install
```

## Instructions

The object of this exercise is to take the following development structure.

```
app
├── components
│   ├── jquery
│   │   └── jquery.js
│   ├── momentjs
│   │   └── moment.js
│   └── underscore
│       └── underscore.js
├── images
│   ├── bower-logo.png
│   └── grunt-logo.svg
├── index.html
├── scripts
│   ├── main.js
│   ├── model.js
│   └── view.js
└── styles
    ├── images.css
    └── main.css
```

And, turn it into this optimized production structure.

```
dist
└── app
    ├── images
    │   ├── bower-logo.fd05710aa2cb9502dc90.png
    │   └── grunt-logo.16c32bb187681923d5a7.svg
    ├── index.html
    ├── scripts
    │   └── main.359737238b7dc0972e52.js
    └── styles
        └── main.6873d02f25d2385b9ec8.css
```

## Detailed Instructions

1. Open Gruntfile.js
2. Replace CSS files with less and configure a `less:dev`-target using
   `grunt-contrib-less`. `index.html` should only include one CSS-file `main.css`.
3. Add a watch target, `watch:less` which invokes `less:dev` when less files
   changes.
4. Add a `less:release` target, which creates an optimized `main.css` in the
   `dist/app/styles` directory.
5. Concatenate the Javascript files using `useminPrepare`, `concat`, and
   `uglify`.
6. Copy images and html files to `dist`
7. Hash all assets (CSS, Javascript, and images) in `dist` using `filrev`
8. Replace the URL:s in the HTML files and the CSS files with `usemin`

## Require.js

1. Change the Javascript-files to use Require.js instead.
2. Minify the newly created file using `grunt-contrib-requirejs` .

## Karma

1. Configure Karma to run the tests
2. Configure Grunt to watch files and run tests.

