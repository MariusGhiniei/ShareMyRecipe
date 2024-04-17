export interface Post {
    _id : String
    post : {
        title : String
        content : String
        imageUrl? : String
        }
    user: {
        firstName : String,
        lastName : String,
        country : String
        }
}