// Build and distribute binaries
const x = require('child_process').execSync

// Package files
const pkg = x('pkg --out-path dist .')

x('mv dist/waveorb-core-macos dist/server-macos')
x('mv dist/waveorb-core-win.exe dist/server-win.exe')
x('mv dist/waveorb-core-linux dist/server-linux')
