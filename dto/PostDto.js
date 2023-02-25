class PostDto {
    constructor(post, user) {
        this.fName = user.FName;
        this.lName = user.LName;
        this.topic = post.Topic;
        this.description = post.Description;
        this.image = post.Image;
        this.role = user.UserRole;
    }
}

module.exports = PostDto