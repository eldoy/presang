module.exports = {
  q: function q (s) { return document.querySelector(s) },
  qa: function qa (s) { return document.querySelectorAll(s) }
}

// Minified:
// function q(e){return document.querySelector(e)}function qa(e){return document.querySelectorAll(e)}