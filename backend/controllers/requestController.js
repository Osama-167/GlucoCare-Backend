import Registration from '../models/registration.js'
import Doctor from '../models/doc.js'
import User from '../models/users.js'; // تأكد إن ده موجود عندك


export const sendRequest = async (req, res) => {
  const { user, doctor } = req.body;

  try {
    const existing = await Registration.findOne({ user, doctor });

    if (existing) {
      return res.status(400).json({ success: false, message: "Request already exists" });
    }

    const request = new Registration({
      user,
      doctor,
      status: "waiting",
      registeredAt: new Date()
    });

    await request.save();
    res.status(200).json({ success: true, message: "Request sent successfully" });
  } catch (error) {
    console.error("Send request error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getPendingRequests = async (req, res) => {
    const { doctorId } = req.params;
  
    try {
      const requests = await Registration.find({ doctor: doctorId, status: "waiting" })
        .populate("user", "firstName lastName"); 
  
      res.status(200).json({ success: true, data: requests });
    } catch (error) {
      console.error("Get pending error:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  };

export const respondToRequest = async (req, res) => {
  const { user, doctor, action } = req.body;

  try {
    if (action === "deny") {
      await Registration.deleteOne({ user, doctor });
      return res.status(200).json({ success: true, message: "Request denied and deleted" });
    }

    if (action === "approve") {
      const updated = await Registration.findOneAndUpdate(
        { user, doctor },
        { status: "approved" },
        { new: true }
      );
      return res.status(200).json({ success: true, message: "Request approved", data: updated });
    }

    res.status(400).json({ success: false, message: "Invalid action" });
  } catch (error) {
    console.error("Respond to request error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getApprovedConnections = async (req, res) => {
  const { doctorId } = req.params;

  try {
    const connections = await Registration.find({ doctor: doctorId, status: "approved" });
    res.status(200).json({ success: true, data: connections });
  } catch (error) {
    console.error("Get approved error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
export const getSentRequests = async (req, res) => {
    const { userId } = req.params;
  
    try {
      const requests = await Registration.find({ user: userId });
      res.status(200).json({ success: true, data: requests });
    } catch (error) {
      console.error("Get sent requests error:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  };


export const getApprovedDoctorsForUser = async (req, res) => {
    const { userId } = req.params;
  
    try {
      const registrations = await Registration.find({ user: userId, status: "approved" });
  
      const doctorIds = registrations.map(reg => reg.doctor);
      const doctors = await Doctor.find({ _id: { $in: doctorIds } });
  
      res.status(200).json({ success: true, data: doctors });
    } catch (error) {
      console.error("Get approved doctors error:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  };


export const deleteRequest = async (req, res) => {
  try {
    const { requestId } = req.params;

    const deleted = await Registration.findByIdAndDelete(requestId);

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Request not found" });
    }

    res.status(200).json({ success: true, message: "Request deleted successfully" });
  } catch (error) {
    console.error("Delete request error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getApprovedPatientsCount = async (req, res) => {
  const { doctorId } = req.params;

  try {
    const count = await Registration.countDocuments({ doctor: doctorId, status: 'approved' });

    res.status(200).json({ success: true, count });
  } catch (error) {
    console.error("Count approved patients error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};





export const getGenderStats = async (req, res) => {
  const { doctorId } = req.params;

  try {
    const approvedRegs = await Registration.find({ doctor: doctorId, status: 'approved' });

    const userIds = approvedRegs.map(reg => reg.user); 

    const users = await User.find({ _id: { $in: userIds } });

    const maleCount = users.filter(u => u.gender === 'Male').length;
    const femaleCount = users.filter(u => u.gender === 'Female').length;

    res.status(200).json({
      success: true,
      male: maleCount,
      female: femaleCount,
    });
  } catch (error) {
    console.error('Error in gender stats:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
