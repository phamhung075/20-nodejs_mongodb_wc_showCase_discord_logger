'use strict';
const { OKResponse } = require('../core/success.response');
const {
    createComment,    
} = require('../services/comment.service');

class CommentController {
    createComment = async (req, res, next) => {
        new OKResponse({
            message: 'create comment success',
            metadata: await createComment(req.body),
        }).send(res);
    }
}
module.exports = new CommentController();