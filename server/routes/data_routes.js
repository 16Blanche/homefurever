const userController = require('../controllers/user_controller');
const petController = require('../controllers/pets_controller');
const storeController = require('../controllers/store_controller');
const verifiedController = require('../controllers/verified_controller');
const archivedController = require('../controllers/archivedpet_controller');
const staffController = require('../controllers/staff_controller');
const adminController = require('../controllers/admin_controller');
const deletedController = require('../controllers/deletedadmin_controller');
const eventController = require("../controllers/event_controller");
const dashboardController = require("../controllers/summary_controller");
const emailController = require("../controllers/email_controller");
const barangayController =require("../controllers/barangay_controller");
const adoptionController = require("../controllers/adoption_controller");
const nearbyController = require("../controllers/nearby_controller");
const activityLogController =require("../controllers/activitylog_controller");
const { authenticateJWT, isSuperAdmin, isAdminOrSuperAdmin, isPendingUser, isVerifiedUser} = require('../middlewares/auth');

module.exports = (app, upload) => {
    app.get('/api/test',(req,res)=>{
        res.json({message:"the api is working"})}
        );
    
    // api links for staff
    app.post('/api/staff/new', staffController.newStaff);
    app.get('/api/staff/all',staffController.findAllStaff);
    app.get('/api/staff/id/:id',staffController.findStaffById);
    app.put('/api/staff/update/:id', staffController.updateStaff);
    app.delete('/api/staff/delete/:id', staffController.findStaffByIdDelete);

    // api links for admins
    app.post('/api/admin/new', adminController.newAdmin);
    app.get('/api/admin/all', adminController.findAllAdmins);
    app.delete('/api/admin/delete/:id', adminController.findAdminByIdDelete);
    app.post('/api/send-email', emailController.sendEmail);
    app.patch('/api/admin/update/:id', adminController.updateAdminRole);
    app.post('/api/deletedadmin/new/:id', deletedController.newDeletedAdmin);
    app.patch('/api/admin/update-credentials/:id', adminController.updateAdminCredentials);

    // api links for user
    // app.post('/api/user/new',userController.newUser);
    app.post('/api/user/new', upload.fields([{ name: 'p_img' }, { name: 'p_validID' }]), userController.newUser);
    app.get('/api/user/all',userController.findAllUser);
    app.get('/api/user/username/:pusername',userController.findUserByUname);
    app.delete('/api/user/delete/:id', userController.deleteUserById);
    app.post('/api/user/login', userController.login);
    app.get('/api/user/profile', authenticateJWT, userController.getUserProfile);
    app.get('/api/my/adoptions', authenticateJWT, userController.getUserAdoptions);

    // api links for adoption
    app.post('/api/adoption/submit', authenticateJWT, adoptionController.submitAdoptionForm);
    app.patch('/api/adoption/decline/:id', authenticateJWT, isAdminOrSuperAdmin, adoptionController.declineAdoption);
    app.patch('/api/adoption/approve/:id', authenticateJWT, isAdminOrSuperAdmin, adoptionController.approveAdoption);
    app.get('/api/adoption/pending', adoptionController.getPendingAdoptions);
    app.get('/api/adoption/active', adoptionController.getActiveAdoptions);
    app.patch('/api/adoption/complete/:id', authenticateJWT, isAdminOrSuperAdmin, adoptionController.completeAdoption);
    app.patch('/api/adoption/fail/:id', authenticateJWT, isAdminOrSuperAdmin, adoptionController.failAdoption);
    app.patch('/api/submit/feedback', adoptionController.submitFeedback);
    app.get('/api/feedback/check/:adoptionId', authenticateJWT, adoptionController.checkFeedbackExists);
    app.get('/api/feedback', adoptionController.getAllFeedbacks);
    app.get('/api/adoption/past', adoptionController.getPastAdoptions);

    // api links for verified users
    app.delete('/api/user/delete/transfer/:id', verifiedController.deleteUserByIdAndTransferData);
    app.get('/api/verified/all', verifiedController.findAllVerified);
    app.get('/api/verified/:vusername', verifiedController.findVerifiedByUname);
    app.put('/api/user/:id/role', userController.updateUserRole);
    // app.put('/api/user/:id/role', authenticateJWT, isSuperAdmin, userController.updateUserRole);

    // api links for pets
    app.post('/api/pet/new', upload.array('pet_img', 10), authenticateJWT, isAdminOrSuperAdmin, petController.newPet);
    app.get('/api/pet/all',petController.findAllPet);
    app.get('/api/pet/name/:pname',petController.findPetByName);
    app.get('/api/pet/type/:ptype',petController.findPetByType);
    app.get('/api/pet/gender/:pgender',petController.findPetByGender);
    app.get('/api/pet/breed/:pbreed',petController.findPetByBreed);
    app.get('/api/pet/:id',petController.findPetById);
    app.put('/api/pet/update/:id', authenticateJWT, isAdminOrSuperAdmin, petController.updatePet);
    app.put('/api/pet/archive/:id', authenticateJWT, isAdminOrSuperAdmin, petController.archivePet);
    app.delete('/api/pet/delete/:pid',petController.findPetByIdDelete);
    app.post('/api/pet/restore/:id', petController.restorePetFromArchive);
    app.post('/api/pet/reset-counter', petController.resetCounter);
    app.get('/api/pet/for-adoption', petController.findPetsForAdoption);
    app.put('/api/pet/update-status/:id',  authenticateJWT, isAdminOrSuperAdmin, petController.updatePetStatus);  

    // api links for archived pets
    app.delete('/api/pet/delete/transfer/:id/:archiveReason', archivedController.deletePetByIdAndTransferData);
    app.get('/api/archived/all', archivedController.findAllArchived);
    app.get('/api/archived/:apname', archivedController.findArchivedByName);
    app.put('/api/archived/update/:apname',archivedController.updateArchivedPet);

    // api links for store
    app.post('/api/store/new',storeController.newItem);
    app.get('/api/store/all',storeController.findAllItems);

    // api links for events
    app.post('/api/events/new', authenticateJWT, isAdminOrSuperAdmin, upload.single('e_image'), eventController.newEvent);
    app.get('/api/events/all',eventController.findAllEvents);
    app.get('/api/events/date/:date', eventController.findEventsByDate);
    app.delete('/api/events/delete/:id',authenticateJWT, isAdminOrSuperAdmin,eventController.findEventByIdDelete);
    app.put('/api/events/update/:id',authenticateJWT, isAdminOrSuperAdmin,eventController.updateEvent);

    // api links for dashboard
    app.get('/api/dashboard/pets',dashboardController.getPetCounts);
    app.get('/api/dashboard/adopted',dashboardController.getAdoptedCounts);
    app.get('/api/dashboard/pending',dashboardController.getPendingCounts);
    app.get('/api/dashboard/verified',dashboardController.getVerifiedCounts);

    // api links for barangay
    app.post('/api/barangay/new', authenticateJWT, isAdminOrSuperAdmin, barangayController.newBarangayInfo);
    app.get('/api/barangay/all', barangayController.findAllInfo);
    app.put('/api/barangay/update/:id', authenticateJWT, isAdminOrSuperAdmin, barangayController.updateBarangayInfo);
    app.post('/api/barangay/export', authenticateJWT, isAdminOrSuperAdmin, barangayController.logExportActivity);


    // api links for nearby services
    app.post('/api/service/new', upload.single('ns_image'), authenticateJWT, isAdminOrSuperAdmin, nearbyController.createNearbyService);
    app.put('/api/service/update/:id', upload.single('ns_image'), authenticateJWT, isAdminOrSuperAdmin, nearbyController.editNearbyService);
    app.get('/api/service/all', nearbyController.getAllNearbyServices);
    app.get('/api/service/:id', nearbyController.getNearbyServiceById);
    app.delete('/api/service/delete/:id', authenticateJWT, isAdminOrSuperAdmin, nearbyController.deleteNearbyService);

    // api links for logs
    app.get('/api/logs/all', activityLogController.getAllActivityLogs);
};