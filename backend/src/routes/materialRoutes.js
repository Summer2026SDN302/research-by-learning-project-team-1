const express = require('express');
const router = express.Router();
const materialController = require('../controllers/materialController');
const {
    createMaterialRules,
    updateMaterialRules,
} = require('../validators/materialValidator');
const validate = require('../middlewares/validate');
const { authenticate, authorize } = require('../middlewares/auth');

router.use(authenticate);

router.get('/', materialController.getMaterials);
router.get('/:id', materialController.getMaterialById);

router.post(
    '/',
    authorize('lecturer', 'admin'),
    createMaterialRules,
    validate,
    materialController.createMaterial
);
router.put(
    '/:id',
    authorize('lecturer', 'admin'),
    updateMaterialRules,
    validate,
    materialController.updateMaterial
);
router.delete(
    '/:id',
    authorize('lecturer', 'admin'),
    materialController.deleteMaterial
);

router.post('/:id/download', materialController.downloadMaterial);

module.exports = router;
