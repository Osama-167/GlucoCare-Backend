import express from 'express';
import {
     signUp,
     signIn,
     getCounts, 
     getGenderStats,
      getMonthlyRegistrations,
      getAllUsers,
       createUser ,
       updateUser,
        deleteUser,
        createDoctor,
        getAllDoctors,
        updateDoctor,
        deleteDoctor,
        getGenderRegistrationStats,
        getMonthlyGenderRegistrations

     } from '../controllers/admin.js';

const router = express.Router();

router.post('/signup', signUp);
router.post('/signin', signIn);


router.get('/counts', getCounts);
router.get('/gender-stats', getGenderStats);
router.get('/monthly-registrations', getMonthlyRegistrations);


router.get('/users', getAllUsers);
router.post('/create-user', createUser);
router.put('/update-user/:id', updateUser);
router.delete('/delete-user/:id', deleteUser);


router.post('/create-doctor', createDoctor);
router.get('/doctors', getAllDoctors);
router.put('/update-doctor/:id', updateDoctor);
router.delete('/delete-doctor/:id', deleteDoctor);


router.get('/gender-registration-stats', getGenderRegistrationStats);
router.get('/monthly-gender-registrations', getMonthlyGenderRegistrations);


export default router;
