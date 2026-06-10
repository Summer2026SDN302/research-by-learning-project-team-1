const express = require('express');
const router = express.Router();
const workspaceController = require('../controllers/workspaceController');
const { createTaskRules, updateTaskRules, uploadDocRules, createLinkRules, sendMessageRules } = require('../validators/workspaceValidator');
const validate = require('../middlewares/validate');
const { authenticate } = require('../middlewares/auth');

router.use(authenticate);

router.get('/:teamId/overview', workspaceController.getWorkspaceOverview);

router.post('/:teamId/tasks', createTaskRules, validate, workspaceController.createTask);
router.get('/:teamId/tasks', workspaceController.getTasks);
router.put('/:teamId/tasks/:taskId', updateTaskRules, validate, workspaceController.updateTask);
router.delete('/:teamId/tasks/:taskId', workspaceController.deleteTask);

router.post('/:teamId/documents', uploadDocRules, validate, workspaceController.uploadDocument);
router.get('/:teamId/documents', workspaceController.getDocuments);
router.put('/:teamId/documents/:docId', workspaceController.updateDocument);
router.delete('/:teamId/documents/:docId', workspaceController.deleteDocument);

router.post('/:teamId/links', createLinkRules, validate, workspaceController.createLink);
router.get('/:teamId/links', workspaceController.getLinks);
router.put('/:teamId/links/:linkId', workspaceController.updateLink);
router.delete('/:teamId/links/:linkId', workspaceController.deleteLink);

router.post('/:teamId/messages', sendMessageRules, validate, workspaceController.sendMessage);
router.get('/:teamId/messages', workspaceController.getMessages);
router.put('/:teamId/messages/:messageId', sendMessageRules, validate, workspaceController.editMessage);
router.patch('/:teamId/messages/:messageId/pin', workspaceController.pinMessage);
router.delete('/:teamId/messages/:messageId', workspaceController.deleteMessage);

module.exports = router;
