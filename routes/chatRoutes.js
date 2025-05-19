import express from "express";
import {
     getMessages, 
     sendMessage
     }
      from "../controllers/chatController.js";

const router = express.Router();

router.get("/messages", getMessages);
router.post("/send", sendMessage);

export default router;
