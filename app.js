const express = require('express')
const app = express()
const port = 8080
const post = require('./post') 
const microblog = require('./microblog')
const posts = require('./texting')
const myBlog = new microblog()
myBlog.posts = posts()

var route = '/posts/:id'

var route_like = '/posts/:id/like'

// response headers
var headers = {
    'Content-Type':'Application/json; charset=utf-8',
    'Keep-Alive':'timeout=6'
}    

// app.use(express.json) antes para processar o request com json e método POST
// app.use(express.urlencoded({extended: true}))



// retorna a página inicial
app.get('/', (req, res)=>{
    res.status(200).send("You're at home")
    
    
})
// retorna todos os posts no formato JSON, caso existam posts
app.get('/posts', (req, res)=>{
    let posts = myBlog.posts
    if(posts){
        res.send({posts})
    }else{res.send({})}
    
})



// retorna post por id ou nada, se não encontrar o post solicitado retorna status 404
app.get(route, (req, res)=>{
    let post = myBlog.retrieve(req.params.id)
    if(post){
        res.set(headers)
        res.status(200).send({post})
    } else { res.status(404).send({}) }
        
    
})

// retorna post deletado e código 204, caso o post exista, do contrário, retorna not found e código 404

app.delete(route, (req, res)=>{
    let post = myBlog.delete(req.params.id)
    if(post){
        res.set(headers)
        res.sendStatus(204)
    }else{res.status(404).send('404 -  NOT FOUND')}
})

// faz um update em um post, caso ele exista

app.use(express.json());
//app.use(express.urlencoded({extended: true}));
app.put(route, (req, res)=> {
    let pst = myBlog.retrieve(req.params.id)
    if(pst){
        new_post = new post()
        new_post.id = pst.id
        if(req.body.text){
            new_post.text = req.body.text
        }else{new_post.text = pst.text}
        if(req.body.likes){
            new_post.likes = req.body.likes
        }else{new_post.likes = pst.likes}
        myBlog.update(new_post)
        res.set(headers)
        res.sendStatus(200)
    }else{ res.status(404).send('404 -  NOT FOUND')}
})
// update um post, caso ele exista
app.patch(route, (req, res)=> {
    let pst = myBlog.retrieve(req.params.id)
    if(pst){
        new_post = new post()
        new_post.id = pst.id
        if(req.body.text){
            new_post.text = req.body.text
        }else{new_post.text = pst.text}
        if(req.body.likes){
            new_post.likes = req.body.likes
        }else{new_post.likes = pst.likes}
        myBlog.update(new_post)
        res.set(headers)
        res.sendStatus(200)
    }else{ res.status(404).send('404 -  NOT FOUND')}
})
// incrementa likes
app.patch(route_like, (req, res)=> {
    let pst = myBlog.retrieve(req.params.id)
    if(pst){
        pst.liked()
        myBlog.update(pst)
        res.set(headers)
        res.sendStatus(200)
    }else{ res.status(404).send('404 -  NOT FOUND')}
})
// cria id universal
var uuid = 0
// encontra a id do ultimo post e atribui o valor a variavel uuid
// considere tornar uma função middleware no futuro, mas por questão de legibilidade do codigo isso não foi feito aqui
myBlog.posts.forEach(element => {
    if(element.id > uuid){
        uuid = element.id
    }
    
});
// cria um novo post
app.post('/posts', (req, res)=>{
    let pst = new post()
    uuid = uuid+1
    pst.id = uuid
    pst.text = req.body.text
    myBlog.create(pst)
    res.status(201).send(myBlog.retrieve(uuid))
})

app.listen(port, ()=>{
    console.log(`Example app listening at port ${port}`)
})