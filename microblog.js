
class microblog{
    posts = []

    
    create(post){
        this.posts.push(post);
    }

    retrieve(id){
        for (let i=0; i < this.posts.length; i++){
            if(this.posts[i].id == id){
                return this.posts[i]
            }
        }
    }

    delete(id){
        for (let i=0; i < this.posts.length; i++){
            if(this.posts[i].id == id){
                let p = this.posts.splice(i,1)
                return p
            }
        }
    }
    update(post){
        for (let i=0; i < this.posts.length; i++){
            if(this.posts[i].id == post.id){
                this.posts[i].text = post.text
                this.posts[i].likes = post.likes
            }
        }
    }

    retrieveAll(){
        return this.posts
    }


}



module.exports = microblog