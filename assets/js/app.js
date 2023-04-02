import { log } from './log.js'

require('@css/bootstrap.css')
require('@css/app.less')

const a = 'allez tous vous faire sodomiser par de grec coincé dans un kebab'
const [b, , c] = [1, 2, 3, 4, 5]
log(a)
log(b)
log(c)
console.log('salut')
document.getElementById('button').addEventListener('click', function () {
  require.ensure(
    [],
    function (require) {
      const $ = require('jquery')
      $('body').css('backgroundColor', '#ff0000')
    },
    'jquery'
  )
  // import('jquery').then(($) => {
  //   $('body').css('backgroundColor', '#ff0000')
  // }, 'jquery')
})
