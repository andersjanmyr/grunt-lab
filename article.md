# Clean Grunt

Grunt is the tool of choice for many client side web projects. But, often the
gruntfiles look like a mess. I believe the reason for this is that many people
don't care about keeping it clean. On top of that, the file is often generated
by a tool, such as Yeoman, and not cleaned up after.  I happen to think that
the gruntfile should be clean and here is a how to do it.

Here is how the project structure looks in development mode. I keep all my
client side code in an `app` directory and I use Bower to install external
components into `app/components`

```sh
app
    components
        jquery
            jquery.js
        momentjs
            moment.js
    images
        bower-logo.png
        grunt-logo.svg
    index.html
    scripts
        main.js
        model.js
        view.js
    styles
        images.css
        main.css
```

I will use `less, watch, concat, uglify, filerev` and `usemin` to
optimize it and turn it into this.

```sh
dist
    app
        images
            bower-logo.fd05710aa2cb9502dc90.png
            grunt-logo.16c32bb187681923d5a7.svg
        index.html
        scripts
            main.359737238b7dc0972e52.js
        styles
            main.6874d02f25d2385b9ec8.css
```

The above structure is good because it serves *one* CSS file, *one* Javascript
file, and everything apart from `index.html` is named with an MD5 checksum that
allow me to cache everything infinitely!


## Loading External Tasks

Loading tasks in Grunt is done with `grunt.loadNpmTasks` but since all
dependenciies is already declared in `package.json` there is no need to name
them again. So instead we use `matchdep` to load all Grunt dependencies
automatically.

```javascript
// Load all files starting with `grunt-`
require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
```

The relevant section in `package.json` contains these files. All Grunt plugins
follow the `grunt-` naming convention.

```javascript
 "devDependencies": {
    "bower": "~1.2.8",
    "grunt": "~0.4.2",
    "matchdep": "",
    "grunt-contrib-jshint": "",
    "grunt-contrib-less": "",
    "grunt-contrib-copy": "",
    "grunt-contrib-clean": "",
    "grunt-contrib-watch": "",
    "grunt-express-server": "",
    "grunt-contrib-cssmin": "",
    "grunt-usemin": "",
    "grunt-filerev": "",
    "grunt-contrib-concat": "",
    "grunt-contrib-uglify": ""
  }
}
```

## JsHint

I think it is a good idea to run JsHint for all my files including the
Gruntfile and here is how I configure it.

```javascript
// JsHint configuration is read from packages.json
var pkg = grunt.file.readJSON('package.json');

grunt.initConfig({
    pkg: pkg,

    // JsHint
    jshint: {
        options: pkg.jshintConfig,
        all: [
            'Gruntfile.js',
            'app/scripts/**/*.js',
            'test/**/*.js'
        ]
    }
}
```

Newer versions of JsHint can pick up configuration from `package.json` and I
take advantage of this so I don't have a duplicate configuration in a `.jshint`
file that is normally added when using a generated project.

The relevant section in `package.json` is defined like this:

```javascript
 "jshintConfig": {
    ...
    "maxparams": 4,
    "maxdepth": 2,
    "maxcomplexity": 6,
    ...
  }
```

I truncated the section for brevity but I kept my favorite configuration
options that deal with complexity and forces me to keep my code simple.


## Less

As I wrote in [CSS Good Practices](http://anders.janmyr.com/2012/08/css-good-practices.html),
I think using a CSS preprocessor is a really good idea and I use Less in this
project. Since Less is a superset of CSS all I have to do to use less is to
change the extension from `.css` to `.less` and configure Grunt to convert Less
files into CSS. In development mode I like to have the CSS files in the same
place I would have put them if I wasn't using Less. To avoid accidentally
checking the generated files into source control I add the following line to
`.gitignore`

```bash
# .gitignore
app/styles/*.css
```

Here is the configuration for generating a CSS file. I add two targets, one for
development and one for release which is compressed.

```javascript
// Less
less: {
    dev: {
        src: 'app/styles/main.css',
        dest: 'app/styles/main.less'
    },
    release: {
        src: 'app/styles/main.css',
        dest: 'dist/app/styles/main.less',
        options: {
            compress: true
        }

    }
}
```

As you can see I only name one less file. I think it is a good idea to include
all less files via import statements.

```css
// Less files are automatically included and don't generate new requests.
@import 'other-less-file.less';
```

## Watch

In development mode I also like to have a file watcher that generates the CSS
files automatically when I change a less file. Here is the configuration.

```javascript
// Watch
watch: {
    // watch:less invokes less:dev when less files change
    less: {
        files: ['app/styles/*.less'],
        tasks: ['less:dev']
    }
}
```

## Clean

It is also a good idea to be able to remove generated files with one command
`clean` will do that for me.

```javascript
// Clean
clean: {
    // clean:release removes generated files
    release: [
        'dist',
        'app/styles/*.css'
    ]
}
```

## Concat, Uglify and Usemin Prepare

To concatenate and minify the Javascript files, I use `concat` and `uglify`.
But I don't want the files used in `index.html` to be automatically included.
To do this I need to use `useminPrepare`. It is one of two tasks included in
`grunt-usemin`, the other is unsuprisingly called `usemin` and I will describe
it later.

`useminPrepare` parses HTML files, looking for tags that follow a distinct
pattern, `<!-- build:js outputfile.js -->` and extracts the filenames from
script tags. These files are then injected into the `concat` and `uglify`
tasks. So, there is no need to provide a configuration for those tasks.

```html
<!-- app/index.html -->

<!-- build:js scripts/main.js -->
<script src="components/jquery/jquery.js" defer></script>
<script src="components/momentjs/moment.js" defer></script>
<script src="scripts/model.js" defer></script>
<script src="scripts/view.js" defer></script>
<script src="scripts/main.js" defer></script>
<!-- endbuild -->
```

```javascript
/// userminPrepare
useminPrepare: {
    html: 'app/index.html',
    options: {
        dest: 'dist/app'
    }
},

// Concat
concat: {
    options: {
        separator: ';'
    },
    // dist configuration is provided by useminPrepare
    dist: {}
},

// Uglify
uglify: {
    // dist configuration is provided by useminPrepare
    dist: {}
}
```

There are a few things that are noteworthy above. `useminPrepare.options.dest`
works in conjunction with the value defined in the `build:js` comment in the
html file. I always designate the root directory of the generated code in the
Gruntfile and I keep the relative path to the file in the HTML file. I do this
because this configuration is reused by the `usemin` task later and configuring
it this way in `useminPrepare` keeps it simpler later.

Also note that `concat` and `uglify` needs to have an empty `dist` property.
Otherwise, `useminPrepare` cannot inject configuration into it.

Running `grunt useminPrepare` shows the generated configuration.
```javascript
concat:
{ options: { separator: ';' },
dist: {},
generated:
  { files:
    [ { dest: '.tmp/concat/scripts/main.js',
        src:
          [ 'app/components/momentjs/moment.js',
            'app/components/jquery/jquery.js',
            'app/scripts/model.js',
            'app/scripts/view.js',
            'app/scripts/main.js' ] } ] } }

uglify:
dist: {},
generated:
  { files:
    [ { dest: 'dist/app/scripts/main.js',
        src: [ '.tmp/concat/scripts/main.js' ] } ] } }
```


Alright, now we have minified both CSS and Javascript, it is time to move the
files that don't need minification, images and html files.

## Copy

```javascript
// Copy HTML and fonts
copy: {
    // copy:release copies all html and image files to dist
    // preserving the structure
    release: {
        files: [
            {
                expand: true,
                cwd: 'app',
                src: [
                    'images/*.{png,gif,jpg,svg}',
                    '*.html'
                ],
                dest: 'dist/app'
            }
        ]
    }
}
```
Here I use a different configuration for the files. The `expand` option is what
is important. I tells grunt to copy the files preserving the structure.

OK, now all the files have been moved into their proper place and all that is
left is to checksum them and rename all the references.

## Filerev, checksumming

`filerev` is my task of choice for adding the checksum of a file to its name. I
use MD5 to checksum all assets, javascript, css and images with this
configuration.

```javascript
// Filerev
filerev: {
    options: {
        encoding: 'utf8',
        algorithm: 'md5',
        length: 20
    },
    release: {
        // filerev:release hashes(md5) all assets (images, js and css )
        // in dist directory
        files: [{
            src: [
                'dist/app/images/*.{png,gif,jpg,svg}',
                'dist/app/scripts/*.js',
                'dist/app/styles/*.css',
            ]
        }]
    }
}
```

## Usemin

The final task is to change all the references in the HTML and CSS files to use
the checksummed filenames and to change the `script` tags to reference the
minified file. `usemin` is the task for this job.

```javascript
// Usemin
// Replaces all assets with their revved version in html and css files.
// options.assetDirs contains the directories for finding the assets
// according to their relative paths
usemin: {
    html: ['dist/app/*.html'],
    css: ['dist/app/styles/*.css'],
    options: {
        assetsDirs: ['dist/app', 'dist/app/styles']
    }
}
```

The only difficult thing about this is that `usemin` uses the paths from the
files it parses when it searches for assets to replace references to. This
means that `options.assetsDirs` must designate the directories where the
parsed files are located. In my case the CSS files are in `dist/app/styles` and
the HTML files are in `dist/app`. Hoohaah! Only one more thing before were
done. Calling all the tasks in order.

## Release

I register the `release` task and tell it to invoke all the other files in
the correct order.

```javascript
// Invoked with grunt release, creates a release structure
grunt.registerTask('release', 'Creates a release in /dist', [
    'clean',
    'jshint',
    'less:release',
    'useminPrepare',
    'concat',
    'uglify',
    'copy',
    'filerev'
]);
```

## Example Code

This example comes from a workshop I give. If you are interested in one send me
a note. If you would like to give one yourself you are welcome to use
[my example code](https://github.com/andersjanmyr/grunt-lab). I also give a
[Grunt presentation](http://andersjanmyr.github.io/grunt-presentation)

That's all folks!





