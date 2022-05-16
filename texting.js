// retorna um array de posts
const array = require('./words')
var myArray = array()
var myBlog = require('./microblog')
var myPost = require('./post')
var micro = new myBlog

var id = 1

for(let i=0; i < myArray.length; i+=3){
    let string = ''
    string = myArray[i]+' '+myArray[i+1]+' '+myArray[i+2]
    let post = new myPost(id, string, string.length)
    micro.create(post)
    id++
}

function blog(){ return micro.posts}

module.exports = blog
