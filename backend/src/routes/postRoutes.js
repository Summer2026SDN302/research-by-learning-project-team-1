const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const { createPostRules, updatePostRules, reactionRules, moderateRules } = require('../validators/postValidator');
const validate = require('../middlewares/validate');
const { authenticate, authorize } = require('../middlewares/auth');

router.use(authenticate);

router.get('/', postController.getPosts);
router.get('/:id', postController.getPostById);

router.post('/', authorize('lecturer', 'admin', 'club_leader'), createPostRules, validate, postController.createPost);
router.put('/:id', authorize('lecturer', 'admin', 'club_leader'), updatePostRules, validate, postController.updatePost);
router.delete('/:id', authorize('lecturer', 'admin'), postController.deletePost);

router.post('/:id/reactions', reactionRules, validate, postController.toggleReaction);
router.get('/:id/reactions', postController.getUserReactions);

router.patch('/:id/moderate', authorize('admin'), moderateRules, validate, postController.moderatePost);

module.exports = router;
