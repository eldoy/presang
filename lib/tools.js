const util = require('util')
const _ = require('lodash')
const uuidv4 = require('uuid/v4')
const cuid = require('cuid')
const bcrypt = require('bcryptjs')

const tools = {}
tools.regexp = {}
tools.regexp.email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
tools.regexp.id = /^[a-z0-9]{24,}$/
tools.regexp.reg = /^%r\/(.+)\/([ig]{0,2})/
tools.regexp.date = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/
tools.regexp.url = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/

tools.uuid = uuidv4
tools.cuid = cuid

tools.hash = function(str, saltRounds = 10) {
  return bcrypt.hashSync(String(str), saltRounds)
}

tools.compare = function(plain, hash) {
  return bcrypt.compareSync(String(plain), String(hash))
}

tools.isEmail = function(str) {
  return tools.regexp.email.test(String(str))
}

tools.isId = function(str) {
  return tools.regexp.id.test(String(str))
}

tools.isRegExp = function(str) {
  return tools.regexp.reg.test(String(str))
}

tools.isDate = function(str) {
  return tools.regexp.date.test(String(str))
}

tools.isURL = function(str) {
  return tools.regexp.url.test(String(str))
}

tools.isBoolean = function(v) {
  return ['false', 'null', 'NaN', 'undefined', '0'].includes(v) ? false : !!v
}

/** Format and interpolate strings */
tools.format = function(str, ...args) {
  for (let i = 0; i < args.length; i++) {
    let val = args[i]
    if (Array.isArray(val)) {
      val = val.join(', ')
    } else if (_.isPlainObject(val)) {
      val = Object.entries(val).map(x => x.join(': ')).join(', ')
    }
    str = str.replace('%s', val)
  }
  return str
}

/** Inspect object */
tools.inspect = function(obj, options = {}) {
  const _obj = _.cloneDeep(obj)
  if (options.exclude) {
    for (const opt of options.exclude) {
      _.set(_obj, opt, null)
    }
  }
  const result = util.inspect(_obj, { showHidden = true, depth = null, colors = true } = options)
  if (!options.quiet) {
    console.log(result)
  }
  return result
}

/** Trim strings in object */
tools.trim = function(obj) {
  for (const key in obj) {
    if (typeof obj[key] === 'object') {
      tools.trim(obj[key])
    } else if (typeof obj[key] === 'string') {
      obj[key] = obj[key].trim()
    }
  }
}

/** Transform JSON string nodes to Javascript native objects */
tools.transform = function(node) {
  for (const k in node) {
    if (node[k] && typeof node[k] === 'object') {
      tools.transform(node[k])
    } else if (typeof node[k] === 'string') {
      node[k] = node[k].trim()
      if (tools.isDate(node[k]) && Date.parse(node[k])) {
        node[k] = new Date(node[k])
      } else if (node[k].match(tools.regexp.reg)) {
        node[k] = new RegExp(RegExp.$1, RegExp.$2)
      }
    }
  }
}

/** Convert values based on type */
tools.convert = function(v, type) {
  switch (type) {
    case 'string': return String(v)
    case 'id': return String(v)
    case 'integer': return parseInt(v)
    case 'float': return parseFloat(v)
    case 'date': return new Date(v)
    case 'boolean': return tools.isBooleanLike(v)
    default: return v
  }
}

module.exports = tools
