import express from 'express'

import { 
    signup,
    signin,
    sendMessage,
    getMessages,register,
    getdoctors,
    changeDoctorPassword,
    getDoctorProfile, 
    updateDoctorProfileData,
 } from '../controllers/doc.js'

const router = express.Router()

router.post('/signup', signup)
// router.post('/med', addMid)
router.post('/signin', signin)

// إرسال رسالة
router.post('/send', sendMessage);

// عرض الرسائل
router.get('/messages', getMessages);
router.post('/register', register);
router.get('/profile', getDoctorProfile); 
router.get('/doctors', getdoctors);
router.post('/change-password', changeDoctorPassword);
router.post('/updateProfile', updateDoctorProfileData); 

export default router
