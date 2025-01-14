'use strict';
const Comment = require('../models/comment.model');

/*
* key feature: Comment CommentService
* + add comment [User, Shop]
* + get a list of comment [User, Shop]
* + get a comment [User, Shop, Admin]
*/
class CommentService {
    static async createComment({
        userId, 
        productId, 
        content, 
        parentCommentId = null
    }) {
        const comment = new Comment({
            comment_productId: productId,
            comment_userId: userId,
            comment_content: content,
            comment_parentId: parentCommentId,
        });

        let rightValue = 0;
        let leftValue = 0;

        if(parentCommentId) {
            // reply comment
            const maxRightValue = await Comment.findOne({
                comment_productId: productId, // Make sure productId is already an ObjectId
            }, 'comment_right', {sort: {comment_right: -1}});
            
            if(maxRightValue) {
                rightValue = maxRightValue.comment_right + 1;
            } else {
                rightValue = 1;
            }
        }

        // insert comment
        comment.comment_left = rightValue;
        comment.comment_right = rightValue + 1;
        await comment.save();
        return comment;
    }
}

module.exports = CommentService;