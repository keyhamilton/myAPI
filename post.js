class post{
    date;
    constructor(id, text, likes){
        this.id = id
        this.text = text
        this.likes = likes
    }

    liked(){
        this.likes++
    }
}

module.exports=post