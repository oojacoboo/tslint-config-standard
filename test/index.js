var fs = require('fs')
var exec = require('child_process').exec
var path = require('path')
var test = require('blue-tape')

var EXT_REGEX = /\.tsx?$/
var TSLINT_BIN = require.resolve('tslint/bin/tslint')
var CONFIG_FILE = path.join(__dirname, '../tslint.js')
var RULES_DIR = path.join(__dirname, 'rules')

test('tslint standard', function (t) {
  var testCases = fs.readdirSync(RULES_DIR)
    .filter(function (filename) {
      return EXT_REGEX.test(filename)
    })
    .map(function (filename) {
      return path.join(RULES_DIR, filename)
    })

  testCases.forEach(function (testCase) {
    var filename = path.relative(RULES_DIR, testCase)

    t.test(filename.replace(EXT_REGEX, ''), function (t) {
      exec('node ' + TSLINT_BIN + ' --config ' + CONFIG_FILE + ' ' + filename, { cwd: RULES_DIR }, function (err, stdout, stderr) {
        t.ok(err)

        fs.readFile(testCase.replace(EXT_REGEX, '.out'), 'utf8', function (err, result) {
          t.notOk(err)

          t.equal(stdout, result)
          t.equal(stderr, '')

          t.end()
        })
      })
    })
  })

  t.end()
})
