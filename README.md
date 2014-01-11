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

1. Open Gruntfile.js
2. Replace CSS files with less and configure a `less:dev`-target using `grunt-contrib-less`
3. Add a watch target that invokes the `less:dev` when less files changes.
4. Concatenate the Javascript files using `useminPrepare` and `concat`
5. Copy images to dist
6. Hash all assets (CSS, Javascript, and images) using `filrev`
7. Replace the URL:s in the HTML files and the CSS files with `usemin`

## Require.js

1. Change the Javascript-files to use Require.js instead.
2. Minify the newly created file using `grunt-contrib-requirejs` .

## Karma

1. Configure Karma to run the tests
2. Configure Grunt to watch files and run tests.

