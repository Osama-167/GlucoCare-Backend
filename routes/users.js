import express from 'express'
import {
  signup,
  signin,
  changePassword,
  addMed,
  getMeds, 
  deleteMed,
  getProfileData,
  addFastingBlood,
  addCumulativeBlood,
  getLatestFasting,
  getLatestCumulative,
  getFastingBloods,
  getCumulativeBloods,
  deleteFastingBlood,
  deleteCumulativeBlood,
  getPatients,
  sendMessage,
  getMessages,
  updateProfileData,
  forgotPassword
} from '../controllers/user.js'

const router = express.Router()

// Authentication Routes
router.post('/signup', signup)
router.post('/signin', signin)
router.post('/changePassword', changePassword);

// Data Routes
router.post('/med', addMed)
router.get('/meds', getMeds) 
router.delete('/med/:id', deleteMed)
router.post('/addFastingBlood', addFastingBlood)
router.get('/latestFasting', getLatestFasting)
router.get('/latestCumulative', getLatestCumulative)
router.post('/addCumulativeBlood', addCumulativeBlood)
router.get('/profile', getProfileData);
router.get('/patients', getPatients);
router.post('/updateProfile', updateProfileData); 

router.post('/forgotPassword', forgotPassword);


// New Glucose Routes
router.get('/fastingBloods', getFastingBloods)
router.get('/cumulativeBloods', getCumulativeBloods)
router.delete('/deleteFastingBlood/:id', deleteFastingBlood)
router.delete('/deleteCumulativeBlood/:id', deleteCumulativeBlood)

// إرسال رسالة
router.post('/send', sendMessage);

// عرض الرسائل
router.get('/messages', getMessages);



export default router
