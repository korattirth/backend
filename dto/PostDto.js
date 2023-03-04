class PostDto {
    constructor(post, user) {
        this.fName = user.fName;
        this.lName = user.lName;
        this.topic = post.topic;
        this.description = post.description;
        this.image = post.image;
        this.role = user.role;
    }
}

module.exports = PostDto