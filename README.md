# Presang
Isomorphic server side rendered (SSR) HTML written in pure vanilla Javascript.

Includes a minimal server. Layouts and pages are loaded into memory on startup for that blazing speed. Web pack is not used, and package size is incredibly small at only 0.6Kb uncompressed!

You can completely control what gets included on the server and what gets loaded after the page is served in the browser without any magic.

Have a look at the [Presang demo](https://github.com/fugroup/presang-demo) for a full example with code.

### Install
```
// Install the library globally
npm i -g presang

// Install the presang library into your app
npm i presang

// Require the libraries inside your pages
const { h } = require('presang')

// Or in your custom server file
const { server } = require('presang')

// Start the server programmatically
server()
```

### Usage
```
// Create an app skeleton
presang create

// Go to your presang app directory and start the server
presang serve

// Build app into static HTML
presang build

// Build into custom directory, default is './dist'
presang build dir

// Command line help
presang help

// To run in production mode (no pretty output)
NODE_ENV=production presang
```
Open http://localhost:5000 in your browser when the server is running.

### App structure
* `app/layouts` - contains your layouts
* `app/pages` - contains your pages
* `app/assets` - contains your external javascript and css

Layouts and pages are javascript files that must export an async function that returns a string of HTML.

### API
Build HTML using the `h` function, it works both on the server and in the browser. Use the `q` function for selecting HTML elements, that only works in the browser.

Create HTML tags with the `h` function. It takes 4 parameters:
* the tag name
* the text content
* its attributes
* an array tags to be rendered inside of it

Find and manipulate HTML element with `q` and `qa`, they are the same as `document.querySelector` and `document.querySelectorAll`.

```javascript
// Write this
h('div', 'text content', { class: 'text' })

// Get this
<div class="text">text content</div>
```
It is easy to create functional components:
```javascript
//
const items = ['Milk', 'Meat', 'Butter']

function list (items) {
  return h('ul', '', {}, items.map(item => h('li', item)))
}

// Somewhere else in your page
h('div', list(items))

// Will give you this
<div><ul><li>Milk</li><li>Meat</li><li>Butter</li></ul></div>
```

```javascript
// Define your layout
const { h, q, qa } = require('presang')

module.exports = async function (page) {
  return [
    h('!doctype', null, { html: true }),
    h('html', '', {}, [
      h('head', '', {}, [
        h('meta', null, { 'http-equiv': 'content-type', content: 'text/html; charset=utf-8' }),

        // The page title is set here
        h('title', page.title || 'Untitled'),
        h('link', null, { rel: 'stylesheet', href: '/app.css', type: 'text/css' }),

        // Include javascript functions like this
        h('script', h),
        h('script', q),
        h('script', qa),
      ]),
      h('body', '', {}, [
        h('section', '', {}, [
          h('nav', '', {}, [
            h('a', 'Home', { href: '/' }),
            h('a', 'About', { href: '/about.html' })
          ]),

          // Insert the page content here
          h('main', '', {}, await page.render())
        ]),

        // Define a javascript function
        h('script', function activeLink () {
          var a = q(`nav a[href='${location.pathname}']`) || q('nav a')
          a.classList.add('active-link')
        }),

        // Call the function on page load
        h('script', 'activeLink()')
      ])
    ])
  ].join('')
}

// Then create a page
var { h } = require('presang')

module.exports = {
  // Name the layout to use, matches the file name
  layout: 'default',

  // The title of the page
  title: 'Home',

  // This is rendered on the server
  render: async function () {

    // Return an array if you have more than one root element
    return [
      h('h1', 'Home'),
      h('p', 'This is your shiny new blazing fast ', {}, [
        h('a', 'Presang app!', { target: '_blank', href: 'https://github.com/fugroup/presang' })
      ])
    ]
  }
}
```
MIT Licensed. Enjoy!