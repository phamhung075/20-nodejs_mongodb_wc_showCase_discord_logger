"use strict";

const express = require("express");
const asyncHandler = require("../../helpers/asyncHandler");
const CommentController = require("../../controllers/comment.controller");
const { authenticationV2  } = require("../../auth/authUtils");
const { createHATEOASMiddleware, createRouter } = require('express-route-tracker');
const router = createRouter(__filename);  // replace const router = express.Router();
//authentication
router.use(authenticationV2);
////////////

router.post('', asyncHandler(CommentController.createComment));

// QUERY //
module.exports = router;
