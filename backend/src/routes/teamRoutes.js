const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teamController');
const {
    createTeamRules,
    updateTeamRules,
    joinRequestRules,
    handleJoinRequestRules
} = require('../validators/teamValidator');
const validate = require('../middlewares/validate');
const { authenticate } = require('../middlewares/auth');

router.use(authenticate);

router.post('/', createTeamRules, validate, teamController.createTeam);
router.get('/', teamController.getTeams);
router.get('/my-teams', teamController.getMyTeams);
router.get('/recommended', teamController.getRecommendedTeams);
router.get('/recommended-teammates', teamController.getRecommendedTeammates);
router.get('/compatibility/:targetId', teamController.getCompatibilityScore);
router.get('/:id', teamController.getTeamById);
router.put('/:id', updateTeamRules, validate, teamController.updateTeam);
router.delete('/:id', teamController.deleteTeam);

router.post('/:id/leave', teamController.leaveTeam);
router.delete('/:id/members/:memberId', teamController.removeMember);

router.post('/:id/join-requests', joinRequestRules, validate, teamController.sendJoinRequest);
router.get('/:id/join-requests', teamController.getTeamJoinRequests);
router.put('/:id/join-requests/:requestId', handleJoinRequestRules, validate, teamController.handleJoinRequest);

module.exports = router;
