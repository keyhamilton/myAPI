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
// config firestore
const admin = require('firebase-admin')
const serviceAccount = require('./myKey.json')
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
})

const db = admin.firestore()

// app.use(express.json) antes para processar o request com json e método POST
// app.use(express.urlencoded({extended: true}))



// retorna a página inicial
app.get('/', (req, res)=>{
    res.status(200).send("You're at home")
    
    
})
// retorna todos os posts no formato JSON, caso existam posts
app.get('/posts', (req, res)=>{
    let posts = []
    db.collection("posts")
    .get()
    .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            posts.push(doc.data())
        });
        return res.status(200).send({...posts});
    })
    .catch((error) => {
        console.log("Error getting documents: ", error);
    }); 
    
    
})



// retorna post por id ou nada, se não encontrar o post solicitado retorna status 404
app.get(route, (req, res)=>{
    let post = {}
    db.collection("posts")
    .get()
    .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            if(req.params.id == doc.data().id){
                post = doc.data()
            }
        });
        return {...post}
    })
    .then((post)=>{
        var size = Object.keys(post).length
        console.log(size)
        if(size > 0){
            return res.status(200).send(post)
        }else{return res.status(404).send(post)}
    })
    .catch((error) => {
        console.log("Error getting documents: ", error);
    }); 
    
})

// retorna post deletado e código 204, caso o post exista, do contrário, retorna not found e código 404

app.delete(route, (req, res)=>{
     
    let postRef = db.collection("posts")
    .get()
    .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            if(req.params.id == doc.data().id){
                postRef = doc.id
            }
            
        });
        return postRef
    })
    .catch((error) => {
        console.log("Error getting documents: ", error);
    });
    postRef.then(id =>{
        db.collection("posts").doc(id).get()
        .then((doc)=>{
            let post = doc
            return post
        })
        .then((post) => {
            console.log(post.data())
            db.collection("posts").doc(post.id).delete()
            res.status(204).send(post.data())
        })
    })
})

// faz um update em um post, caso ele exista

app.use(express.json());
//app.use(express.urlencoded({extended: true}));

let docs =  db.collection('posts').get(); //pega todos os posts --> promise

app.put(route, (req, res)=> {
    let docRef;
    docs.then((doc)=>{
        doc.forEach((post)=>{
            if(post.data().id == req.params.id){
                docRef = post.id;
            }
        })
        return docRef
    })
    .then((docRef)=>{
        if(docRef){
            db.collection('posts').doc(docRef).update(req.body)
            res.status(200).send('updated')
        }else{res.status(404).send('404 - NOT FOUND😫🤬')}
        
    })
    
    //TODO: get docRef / check if exists / check fields to update (req.params)
    //update fields / if bad request, send 404 / if good request, send 200
})
// update um post, caso ele exista
app.patch(route, (req, res)=> {
    let docRef;
    docs.then((doc)=>{
        doc.forEach((post)=>{
            if(post.data().id == req.params.id){
                docRef = post.id;
            }
        })
        return docRef
    })
    .then((docRef)=>{
        if(docRef){
            db.collection('posts').doc(docRef).update(req.body)
            res.status(200).send('updated')
        }else{res.status(404).send('😥 - 404 - NOT FOUND - 🤬')}
        
    })
    //TODO: get docRef / check if exists / check fields to update (req.params)
    //update fields / if bad request, send 404 / if good request, send 200
})
// incrementa likes
app.patch(route_like, (req, res)=> {
    let docRef;
    docs.then((doc)=>{
        doc.forEach((post)=>{
            if(post.data().id == req.params.id){
                docRef = post.id;
            }
        })
        return docRef
    })
    .then((docRef)=>{
        if(docRef){
            db.collection('posts').doc(docRef).update({
                likes: admin.firestore.FieldValue.increment(1)
            })
            res.status(200).send('updated')
        }else{res.status(404).send('😥 - 404 - NOT FOUND - 🤬')}
        
    })
    //TODO: get docRef /check if exists / increment id field of the doc
    
})

app.post('/posts', (req, res)=>{
    
    docs.then((d)=>{
        
        db.collection('posts').add({
            text: req.body.text,
            date: admin.firestore.FieldValue.serverTimestamp(),
            id: d.size+1, //atribui ao campo id quantidade de posts mais um
            likes: 0
        })  
        .then((docRef)=>{

            docRef.get().then((doc) => {
            if (doc.exists) { //retorna true se o post existir
                res.status(201).json(doc.data()); //envia o post criado --> json
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
            })
            .catch((error) => {
                console.log("Error getting document:", error);
            });
        })
    });
})
app.listen(port, ()=>{
    console.log(`Example app listening at port ${port}`)
})