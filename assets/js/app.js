
import {log} from './log.js'
import css from '../css/bootstrap.css'
import less from '../css/app.less'
// console.log(css)

console.log(less)

let a= "allez tous vous faire sodomiser par de grec coincé dans un kebab"
let [b,,c] = [1,2,3,4,5]
log(a)
log(b)
console.log("salut")
document.getElementById('button').addEventListener('click',function() {
    require.ensure([], function(require) {
        const $ = require('jquery');
        $('body').css('backgroundColor', '#ff0000');
      }, 'jquery');
    // import('jquery').then(($) => {
    //     $('body').css('backgroundColor', '#ff0000');
    //   },'jquery');
})

