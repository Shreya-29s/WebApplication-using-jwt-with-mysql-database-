const express = require('express');
const controller = require('../controllers/controllers');
 const jwt=controller.authenticateUser;
const router = express.Router();


router.post('/signup',jwt,controller.signUp);
router.post('/adminlogin', controller.adminLogin);
router.post('/userlogin', controller.userLogin);

//crud operations on users
router.get('/users',controller.getUsers);
router.get('/users/:id',controller.getUserById);
router.put('/users/:id',controller.updateUser);
// router.post('/users',controller.addUser);
router.delete('/users/:id',controller.deleteUser)
//crud operations on benefits
router.get('/benefits',controller.getBenefits);
router.get('/benefits/:id',controller.getBenefitsById);
router.put('/benefits/:id',controller.updateBenefits);
router.post('/benefits',controller.addBenefit);
router.delete('/benefits/:id',controller.deleteBenefit);
//user Inventory
router.get('/inventorys/:id',controller.getInventory);
router.post('/inventorys/:id',jwt,controller.addToInventory);
router.delete('/inventorys/:id',controller.deleteToInventory);
//requests
router.post('/requestBenefits',controller.addBenefitRequest);
router.get('/requestBenefits',controller.getBenefitRequest);
router.put('/requestBenefits/:id',controller.updateBenefitRequest);
router.delete('/requestBenefits/:id',controller.deleteBenefitRequest);
router.post('/requestUsers',controller.addUserRequest);
router.get('/requestUsers',controller.getUserRequest);
router.put('/requestUsers/:id',controller.updateUserRequest);
router.delete('/requestUsers/:id',controller.deleteUserRequest);

module.exports = router;
