import User from '../models/users.js';
import Med from '../models/med.js';
import Note from '../models/note.js'
import Meal from '../models/meal.js'
import nodemailer from 'nodemailer';
import fastingBlood from '../models/fastingBlood.js';
import cumulativeBlood from '../models/cumulativeBlood.js';
import md5 from 'md5';

export const setMeal =async(req,res)=>{
  const{user,mealName,type}=req.body
  try {
    const savedMeal= await Meal.create({user,mealName,type})
    res.status(200).json({success:true,message:"meal saved successfully"})
  } catch (error) {
    console.log(error)
    res.status(400).json({success:false,message:"error in saving meal"})
  }
}

export const signup = async (req, res) => {
  const {
    firstName,
    lastName,
    userName,
    email,
    password,
    rePassword,
    gender,
    phoneNumber,
    weight,
    diabetesType,
    birthday,
  } = req.body;

  try {
    console.log('Signup attempt for:', email);
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('User already exists');
      return res.status(400).json({ 
        success: false,
        message: 'User already exists' 
      });
    }

    if (password !== rePassword) {
      console.log('Passwords do not match');
      return res.status(400).json({ 
        success: false,
        message: "Passwords don't match" 
      });
    }

    if (!['1', '2', '3'].includes(diabetesType)) {
      return res.status(400).json({
        success: false,
        message: "Diabetes type must be 1, 2, or 3"
      });
    }

    const hashedPassword = md5(password);
    console.log('Generated hash:', hashedPassword);

    const newUser = await User.create({
      firstName,
      lastName,
      userName,
      email,
      password: hashedPassword,
      rePassword: hashedPassword,
      gender,
      phoneNumber,
      weight: Number(weight),
      diabetesType,
      birthday: new Date(birthday),
    });

    console.log('User created successfully:', newUser.email);
    res.status(201).json({
      success: true,
      message: 'User created successfully',
      user: {
        id: newUser._id,
        userName: newUser.userName,
        email: newUser.email,
        diabetesType: newUser.diabetesType
      }
    });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating user',
      error: error.message
    });
  }
};

export const signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log('Login attempt for:', email);

    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found');
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    const hashedPassword = md5(password);
    console.log('Input hash:', hashedPassword);
    console.log('Stored hash:', user.password);

    if (user.password !== hashedPassword) {
      console.log('Password mismatch');
      return res.status(401).json({ 
        success: false,
        message: 'Invalid credentials' 
      });
    }

    user.updatedAt = new Date();
    await user.save();

    console.log('Login successful for:', email);
    res.status(200).json({
      success: true,
      message: 'Login successful',
      user: {
        id: user._id,
        userName: user.userName,
        email: user.email,
        diabetesType: user.diabetesType,
        weight: user.weight,
        gender: user.gender
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message
    });
  }
};


export const addMed = async (req, res) => {
  console.log("body",req.body)
  const { id, medName, effMaterial, times_per_day , dose_time ,type, start, end } = req.body;
  const doseTimesFormatted = dose_time.map(time => new Date(time)); 
  try {
    console.log('Adding medication for user:', id);
    const result = await Med.create({
      user: id,
      medName: medName,
      effMaterial: effMaterial,
      times_per_day: times_per_day,
      dose_time: doseTimesFormatted,
      type: type,
      start: new Date(start),
      end: new Date(end),
    });

    console.log('Medication added successfully');
    res.status(201).json({
      success: true,
      message: 'Medication added successfully',
      data: result
    });

  } catch (error) {
    console.error('Add medication error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding medication',
      error: error.message
    });
  }
};

export const getMeds = async (req, res) => {
  const { userId } = req.query;

  try {
    const meds = await Med.find({ user: userId });
    res.status(200).json({
      success: true,
      data: meds
    });
  } catch (error) {
    console.error('Get medications error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching medications',
      error: error.message
    });
  }
};

export const deleteMed = async (req, res) => {
  try {
    const { id } = req.params;
    
    const med = await Med.findById(id);
    if (!med) {
      return res.status(404).json({ 
        success: false, 
        message: 'Medicine not found' 
      });
    }

    await Med.findByIdAndDelete(id);
    res.status(200).json({ 
      success: true, 
      message: 'Medicine deleted successfully' 
    });
  } catch (error) {
    console.error('Delete medication error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error deleting medication', 
      error: error.message 
    });
  }
};

export const addFastingBlood = async (req, res) => {
  const { user_id, sugar_level } = req.body;

  try {
    console.log('Adding fasting blood for user:', user_id);
    const result = await fastingBlood.create({
      user: user_id,
      value: Number(sugar_level),
      date: new Date()
    });

    console.log('Fasting blood added successfully');
    res.status(201).json({
      success: true,
      message: 'Fasting blood added successfully',
      data: result
    });

  } catch (error) {
    console.error('Add fasting blood error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding fasting blood',
      error: error.message
    });
  }
};

export const addCumulativeBlood = async (req, res) => {
  try {
    const { user_id, sugar_level, date } = req.body;

    if (!user_id || !sugar_level) {
      return res.status(400).json({
        success: false,
        message: 'Missing user_id or sugar_level'
      });
    }

    const result = await cumulativeBlood.create({
      user: user_id,
      value: Number(sugar_level),
      date: date ? new Date(date) : new Date()
    });

    console.log('Cumulative blood added successfully:', result);

    res.status(201).json({
      success: true,
      message: 'Cumulative blood added successfully',
      data: result
    });

  } catch (error) {
    console.error('Add cumulative blood error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding cumulative blood',
      error: error.message
    });
  }
};

export const getFastingBloods = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ 
        success: false, 
        message: 'User ID is required' 
      });
    }

    const readings = await fastingBlood.find({ user: userId }).sort({ date: -1 });
    res.status(200).json({ 
      success: true, 
      data: readings 
    });
  } catch (error) {
    console.error('Error getting fasting blood readings:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to get fasting readings',
      error: error.message 
    });
  }
};

export const getCumulativeBloods = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ 
        success: false, 
        message: 'User ID is required' 
      });
    }

    const readings = await cumulativeBlood.find({ user: userId }).sort({ date: -1 });
    res.status(200).json({ 
      success: true, 
      data: readings 
    });
  } catch (error) {
    console.error('Error getting cumulative blood readings:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to get cumulative readings',
      error: error.message 
    });
  }
};


export const deleteFastingBlood = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedReading = await fastingBlood.findByIdAndDelete(id);
    
    if (!deletedReading) {
      return res.status(404).json({ 
        success: false, 
        message: 'Fasting reading not found' 
      });
    }

    res.status(200).json({ 
      success: true, 
      message: 'Fasting reading deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting fasting reading:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to delete fasting reading',
      error: error.message 
    });
  }
};

export const deleteCumulativeBlood = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedReading = await cumulativeBlood.findByIdAndDelete(id);
    
    if (!deletedReading) {
      return res.status(404).json({ 
        success: false, 
        message: 'Cumulative reading not found' 
      });
    }

    res.status(200).json({ 
      success: true, 
      message: 'Cumulative reading deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting cumulative reading:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to delete cumulative reading',
      error: error.message 
    });
  }
};


export const getLatestFasting = async (req, res) => {
  try {
    const { userId } = req.query;
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    const latestReading = await fastingBlood.findOne({ user: userId })
      .sort({ date: -1 })
      .limit(1);

    if (!latestReading) {
      return res.status(404).json({
        success: false,
        message: 'No fasting readings found'
      });
    }

    res.status(200).json({
      success: true,
      data: latestReading
    });
  } catch (error) {
    console.error('Error in getLatestFasting:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get latest fasting reading',
      error: error.message
    });
  }
};

export const getLatestCumulative = async (req, res) => {
  try {
    const { userId } = req.query;
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    const latestReading = await cumulativeBlood.findOne({ user: userId })
      .sort({ date: -1 })
      .limit(1);

    if (!latestReading) {
      return res.status(404).json({
        success: false,
        message: 'No cumulative readings found'
      });
    }

    res.status(200).json({
      success: true,
      data: latestReading
    });
  } catch (error) {
    console.error('Error in getLatestCumulative:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get latest cumulative reading',
      error: error.message
    });
  }
};


export const changePassword = async (req, res) => {
  try {
    const { userId, oldPassword, newPassword, confirmPassword } = req.body;

    if (!userId || !oldPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.password !== oldPassword) {
      return res.status(401).json({
        success: false,
        message: 'Old password is incorrect'
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'New passwords do not match'
      });
    }

    user.password = newPassword;
    user.rePassword = newPassword;
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });

  } catch (error) {
    console.error('Password change error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

export const getProfileData = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    const user = await User.findById(userId).select('-password -rePassword');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const latestFasting = await fastingBlood.findOne({ user: userId }).sort({ date: -1 }).limit(1);
    const latestCumulative = await cumulativeBlood.findOne({ user: userId }).sort({ date: -1 }).limit(1);
    const medsCount = await Med.countDocuments({ user: userId });

    const age = calculateAge(user.birthday);

    const profileData = {
      name: `${user.firstName} ${user.lastName}`,
      phone: user.phoneNumber,
      email: user.email,
      age: age,
      diabetesType: user.diabetesType,
      weight: user.weight,
      fastingSugar: latestFasting?.value || 'Not available',
      cumulativeSugar: latestCumulative?.value || 'Not available',
      medicinesCount: medsCount,
      birthDate: user.birthday ? user.birthday.toISOString().split('T')[0] : null, // اضفت ده 👑
    };

    res.status(200).json({
      success: true,
      data: profileData
    });

  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};



function calculateAge(birthday) {
  if (!birthday) {
    console.error('Birthday is missing or invalid');
    return 0;
  }

  const birthDate = new Date(birthday);
  
  if (isNaN(birthDate.getTime())) {
    console.error('Invalid birthday date:', birthday);
    return 0;
  }

  const today = new Date();
  
  let age = today.getFullYear() - birthDate.getFullYear();
  
  const monthDiff = today.getMonth() - birthDate.getMonth();
  const dayDiff = today.getDate() - birthDate.getDate();
  
  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age--;
  }
  
  return Math.max(0, age);
};

export const getPatients = async (req, res) => {
  try {
    // جلب كل المرضى
    const patients = await User.find({}, 'firstName lastName');  // تحدد فقط البيانات المطلوبة
    
    if (!patients || patients.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No patients found'
      });
    }

    res.status(200).json({
      success: true,
      data: patients
    });

  } catch (error) {
    console.error('Error getting patients:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get patients',
      error: error.message
    });
  }
};


export const sendMessage = async (req, res) => {
  console.log(req.body)
  const { doctorId, userId, content } = req.body;

  try {
    // إضافة الرسالة في قاعدة البيانات
    const newNote = new Note({
      doctor: doctorId,
      user: userId,
      content: content,
      createdAt: new Date()
    });
    await newNote.save();

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      note: newNote
    });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending message',
      error: error.message
    });
  }
};


export const getMessages = async (req, res) => {
  console.log(req.body)

  const { doctorId, userId } = req.query;

  try {
    // جلب الرسائل بين الطبيب والمريض
    const messages = await Note.find({
      doctor: doctorId,
      user: userId
    }).sort({ createdAt: 1 });  // ترتيب الرسائل من الأقدم للأحدث

    res.status(200).json({
      success: true,
      messages: messages
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching messages',
      error: error.message
    });
  }
};



export const updateProfileData = async (req, res) => {
  console.log("Request body:", req.body);

  const { userId, field, value } = req.body;

  if (!userId || !field) {
    console.error("Missing fields:", { userId, field });
    return res.status(400).json({ 
      success: false, 
      message: "User ID and field are required" 
    });
  }

  try {
    const updateObj = {};
    
    if (field === 'name') {
      const [firstName, lastName] = value.split(' ');
      updateObj.firstName = firstName;
      updateObj.lastName = lastName;
    } 
    else if (field === 'birthDate') {
      const birthDate = new Date(value);
      if (isNaN(birthDate.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Invalid birth date format"
        });
      }
      updateObj.birthday = birthDate;
      updateObj.birthDate = birthDate;

    }
    else {
      updateObj[field] = value;
    }

    console.log("Updating user with:", updateObj);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateObj,
      { new: true }
    );

    if (!updatedUser) {
      console.error("User not found:", userId);
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    console.log("Update successful:", updatedUser);
    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: {
        id: updatedUser._id,
        ...updateObj
      }
    });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error",
      error: error.message 
    });
  }
};




export const forgotPassword = async (req, res) => {
  let email = req.body.email;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: 'Email is required'
    });
  }

  email = email.trim().toLowerCase();

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No user found with this email'
      });
    }

    const newPassword = `pass${Math.floor(1000 + Math.random() * 9000)}`;
    const hashedPassword = md5(newPassword);

    user.password = hashedPassword;
    user.rePassword = hashedPassword;
    await user.save();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: '201900219@pua.edu.eg',            
        pass: 'ecuyxldmqgrrvfcs'                
      }
    });

    const mailOptions = {
      from: '201900219@pua.edu.eg',             
      to: email,                                
      subject: 'GlucoCare Password Reset',
      text: `Hello,

You requested a password reset for your GlucoCare account.

🔐 Your new temporary password is: ${newPassword}

Please use this password to log in, and make sure to change it immediately after login from the profile settings for better security.

Thank you,
GlucoCare Team`
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({
      success: true,
      message: 'New password sent to your email'
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error. Please try again.'
    });
  }
};