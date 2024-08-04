const express = require('express');
const { GitHubInfo } = require('../controller/GitHubController.js');
const router = express.Router();

router.post('/github-repos', GitHubInfo);


module.exports = router;