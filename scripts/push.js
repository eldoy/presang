// Upload files to waveorb-bin remote via git
const exec = require('child_process').execSync

function x(cmd) {
  const result = exec(cmd)
  console.log(result.toString())
}

// Change dir
process.chdir('../waveorb-bin')

console.log('Changing to ../waveorb-bin')

// Pull changes
x('git pull')

// Package files
x('cp -Rv ../waveorb-core/dist/* .')

// // Publish with git
x('git add --all')

x('git commit -m "New version"')

// // Publish with git
x('git push')
