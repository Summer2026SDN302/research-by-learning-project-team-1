const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const {
    createUserRules,
    updateUserRules,
    changeRoleRules,
} = require('../validators/adminValidator');
const validate = require('../middlewares/validate');
const { authenticate, authorize } = require('../middlewares/auth');

router.use(authenticate, authorize('admin'));

router.get('/users', adminController.getAllUsers);
router.get('/users/:id', adminController.getUserById);
router.post('/users', createUserRules, validate, adminController.createUser);
router.put('/users/:id', updateUserRules, validate, adminController.updateUser);
router.delete('/users/:id', adminController.deleteUser);
router.patch('/users/:id/role', changeRoleRules, validate, adminController.changeUserRole);

module.exports = router;
