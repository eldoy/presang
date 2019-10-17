# Presang
Isomorphic server side rendered (SSR) HTML written in pure vanilla Javascript.

Includes a minimal server. Layouts and pages are loaded into memory on startup for that blazing speed. Web pack is not needed, and package size is incredibly small at only 0.5Kb uncompressed!

You can completely control what gets included on the server and what gets loaded after the page is served in the browser without any magic.

Have a look at the [Presang demo](https://github.com/fugroup/presang-demo) for a full example with code.

### Install
```
// Install the library globally
npm i -g presang
```

### Usage
```
// Create an app skeleton
presang create

// Install the presang library into your app
npm i presang

// Go to your presang app directory and start the server
presang serve

// Require the libraries inside your layouts and pages
const { h, q, qa } = require('presang')

// Or in your custom server file
const { server } = require('presang')

// Start the server programmatically
server()

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

### Cookies
Presang has cookie support for storing data between pages.
```javascript
// On the server
// Set cookie, expires in 30 days
$.req.cookie('name', 'hello')

// Set cookie with custom expiry in days
$.req.cookie('name', 'hello', 365)

// Get cookie
$.req.cookie('name')

// Delete cookie
$.req.cookie('name', '', -1)

// In the browser
// Set cookie, expires in 30 days
cookie('name', 'hello')

// Set cookie with custom expiry in days
cookie('name', 'hello', 365)

// Get cookie
cookie('name')

// Delete cookie
cookie('name', '', -1)
```

### API
Create HTML tags with the `h` function. It takes 4 parameters:
* the tag name
* the text content
* its attributes as an object
* an array of tags to be rendered inside of it

Find and manipulate HTML elements with `q` and `qa`. They are the same as `document.querySelector` and `document.querySelectorAll`, and only work in the browser.

```javascript
// Write this
h('div', 'text content', { class: 'text' })

// Get this
<div class="text">text content</div>
```
It is easy to create functional components:
```javascript
// Some data from your server API
const items = ['Milk', 'Meat', 'Butter']

// Create the list component
function list (items) {
  return h('ul', '', {}, items.map(item => h('li', item)))
}

// Use the list component somewhere else
h('div', list(items))

// Will give you this
<div><ul><li>Milk</li><li>Meat</li><li>Butter</li></ul></div>
```
### Layouts
Layouts surround your pages. You can have multiple layouts if you wish.
```javascript
// Define your layout
const { h, q, qa } = require('presang')

// The '$' object contains route data:
// $ = { app, req, res, page }
module.exports = async function ($) {
  return [
    h('!doctype', null, { html: true }),
    h('html', '', {}, [
      h('head', '', {}, [
        h('meta', null, { 'http-equiv': 'content-type', content: 'text/html; charset=utf-8' }),

        // The page title is set here
        h('title', $.page.title || 'Untitled'),
        h('link', null, { rel: 'stylesheet', href: '/app.css', type: 'text/css' }),

        // Include javascript functions like this
        h('script', h),
        h('script', q),
        h('script', qa)
      ]),
      h('body', '', {}, [
        h('section', '', {}, [
          h('nav', '', {}, [
            h('a', 'Home', { href: '/' }),
            h('a', 'About', { href: '/about.html' })
          ]),

          // Insert the page content like this
          h('main', '', {}, $.page.content)
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
```

### Pages
Pages are inserted into your layout. Links to internal pages must end with `.html`, and the `index.html` page (home page), must be named `home.js`.

```javascript
// Create a page
var { h } = require('presang')

module.exports = {
  // Name the layout to use, matches the file name
  layout: 'default',

  // The title of the page
  title: 'Home',

  // This is rendered on the server
  render: async function ($) {

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