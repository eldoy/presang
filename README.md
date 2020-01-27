# Presang
Compact web application framework. Build static JamStack or isomorphic server side rendered (SSR) HTML applications in pure vanilla Javascript.

This project is part of the [Waveorb Jamstack web app development framework.](https://waveorb.com) It has all of Presang's features and a lot more, we recommend using that instead.

Includes a minimal server. Layouts and pages are loaded into memory on startup for that blazing speed. Web pack is not needed, there are no dependencies and package size is optionally zero (0) bytes.

You can completely control what gets included on the server and what gets loaded after the page is served in the browser without any magic.


### Install
```
// Install the library globally
npm i -g presang
```

### Usage
Create a new app directory and run the following commands:
```
// Create an app skeleton
presang create

// Init npm
npm init

// Install the presang library into your app
npm i presang

// Go to your presang app directory and start the server
presang serve

// Or in your custom server file
const { serve } = require('presang')
serve()

// Build static HTML into './dist' directory
presang build

// Specify build file with dynamic links
presang build build.js

// The build file should look like this
module.exports = async function() {
  return {
    host: 'http://localhost:5000',
    urls: ['/', '/about.html']
  }
}

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

// In the browser remove the $.req in front
cookie('name', 'hello')
```

### HTML
Create HTML tags using template literals, or include your own template library.
```javascript
`<div>Hello ${ name }</div>`
```

You don't really need a HTML DOM library, but the examples uses [Haka,](https://github.com/eldoy/haka) where you can find and manipulate HTML elements with `html`, `text`, `q` and `qa`, as well as cookie and form handling functions.

You can also use libraries like [JQuery](https://jquery.com) if you want, it's up to you.

### Components
It is easy to create functional components:
```javascript
// Some data from your server API
const items = ['Milk', 'Meat', 'Butter']

// Create the list component
function list (items) {
  return `<ul>${ items.map(item => `<li>${ item }</li>`) }</ul>`
}

// Use the list component somewhere else
`<div>${ list(items) }</div>`

// Will give you this
<div><ul><li>Milk</li><li>Meat</li><li>Butter</li></ul></div>
```

### Layouts
Layouts surround your pages, it is where your title, head, nav and footer usually goes. You can have multiple layouts if you want.
```javascript
const { q, qa, cookie } = require('presang')

module.exports = async function($) {
  function current () {
    var a = q(`nav a[href="${ location.pathname }"]`) || q('nav a')
    a.classList.add('active-link')
  }
  return /* html */`
    <!doctype html>
    <html lang="en">
      <head>
        <meta http-equiv="content-type" content="text/html; charset=utf-8">

        <--! Set page title -->
        <title>${ $.page.title || 'Untitled' }</title>
        <link rel="stylesheet" href="/app.css" type="text/css">

        <--! Include global scripts here -->
        <script>${ q };${ qa };${ cookie }</script>
      </head>
      <body>
        <div class="content">
          <nav>
            <a href="/">home</a>
            <a href="/about.html">about</a>
          </nav>

          <--! Insert the page content here -->
          <main>${ $.page.content }</main>
        </div>

        <--! Insert and call function on page load -->
        <script>${ current }; current()</script>
      </body>
    </html>
  `
}
```

### Pages
Pages are inserted into your layout. Links to internal pages must end with `.html`, and the `index.html` page (home page), must be named `index.js`.

```javascript
module.exports = async function($) {
  // Set the name of the layout, defaults to 'default'
  $.page.layout = 'default',

  // The page title
  $.page.title = 'home'

  return /* html */`
    <h1>home</h1>
    <p>
      this is your shiny new blazing fast
      <a href="https://github.com/eldoy/presang" target="_blank">presang app!</a>
    </p>
  `
}
```
Dynamic URLs can be achieved by using an underscore (`_`) in front of the directory name or the file name. For example, the structure `/posts/_id` will match the URL `/posts/hello.html` and `$.req.query.id` will have the value `hello` inside your page.

MIT Licensed. Enjoy!
