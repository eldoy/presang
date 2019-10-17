const { q, qa, cookie } = require('presang')

module.exports = async function ($) {
  function current () {
    var a = q(`nav a[href="${ location.pathname }"]`) || q('nav a')
    a.classList.add('active-link')
  }
  return `
    <!doctype html>
    <html lang="en">
      <head>
        <meta http-equiv="content-type" content="text/html; charset=utf-8">
        <title>${ $.page.title || 'Untitled' }</title>
        <link rel="stylesheet" href="/app.css" type="text/css">
        <script>${ q };${ qa };${ cookie }</script>
      </head>
      <body>
        <div class="content">
          <nav>
            <a href="/">home</a>
            <a href="/about.html">about</a>
          </nav>
          <main>${ $.page.content }</main>
        </div>
        <script>${ current }; current()</script>
      </body>
    </html>`
}
