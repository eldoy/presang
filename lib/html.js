module.exports = function h (n, x, a, t) {
  a = Object.keys(a || {}).map(function (k) {
    return a[k] === true ? k : k + '="' + a[k] + '"'
  })
  return '<' + (n || '') + (a.length ? ' ' + a.join(' ') : '') + '>'
    + (x || '') + (typeof t === 'string' ? t : (t || []).join(''))
    + (x === null ? '' : '</' + n + '>')
}
