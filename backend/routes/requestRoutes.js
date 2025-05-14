import express from 'express'
import {
    sendRequest,
    getPendingRequests,
    respondToRequest,
    getApprovedConnections,
    getSentRequests,
    getApprovedDoctorsForUser,
    deleteRequest,
    getApprovedPatientsCount,
    getGenderStats,
} from '../controllers/requestController.js'

const router = express.Router()

router.post('/send', sendRequest);
router.get('/pending/:doctorId', getPendingRequests);
router.post('/respond', respondToRequest);
router.get('/approved/:doctorId', getApprovedConnections);
router.get('/sent/:userId', getSentRequests);
router.get('/approved-for-user/:userId', getApprovedDoctorsForUser);
router.delete('/delete-request/:requestId', deleteRequest);
router.get('/approved-patients-count/:doctorId', getApprovedPatientsCount);
router.get('/gender-stats/:doctorId', getGenderStats);






export default router;
