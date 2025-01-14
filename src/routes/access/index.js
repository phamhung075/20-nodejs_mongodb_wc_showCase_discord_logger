"use strict";

const express = require("express");
const asyncHandler = require("../../helpers/asyncHandler");
const accessController = require("../../controllers/access.controller");
const { authenticationV2  } = require("../../auth/authUtils");
const { createHATEOASMiddleware, createRouter } = require('express-route-tracker');
const router = createRouter(__filename);  // replace const router = express.Router();

//signUp
router.post('/signup', asyncHandler(accessController.signUp)); //asyncHandler :catch những handle lỗi thrown ra
router.post('/login', asyncHandler(accessController.login)); 

//authentication
router.use(authenticationV2);
////////////////
router.post('/logout', asyncHandler(accessController.logout));
router.post('/handlerRefreshToken', asyncHandler(accessController.handlerRefreshToken));


module.exports = router;
