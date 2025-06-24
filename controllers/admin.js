import Admin from '../models/admin.js'
import md5 from 'md5';
import User from '../models/users.js'
import Doctor from '../models/doc.js'

export const signUp = async (req, res) => {
  try {
    const { firstName, lastName, email, password, gender, phoneNumber, birthday } = req.body;

    if (!firstName || !lastName || !email || !password || !gender || !phoneNumber || !birthday) {
      return res.status(400).json({ message: 'Please fill all fields.' });
    }

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin already exists.' });
    }

    const hashedPassword = md5(password);

    const newAdmin = new Admin({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      gender,
      phoneNumber,
      birthday
    });

    await newAdmin.save();

    res.status(201).json({ message: 'Admin registered successfully.' });
  } catch (error) {
    console.error('Signup Error:', error);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
};


export const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password.' });
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found.' });
    }

    const hashedPassword = md5(password);
    if (admin.password !== hashedPassword) {
      return res.status(400).json({ message: 'Incorrect password.' });
    }

    res.status(200).json({ message: 'Login successful.', adminId: admin._id });
  } catch (error) {
    console.error('Signin Error:', error);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }

};




export const getCounts = async (req, res) => {
  try {
    const usersCount = await User.countDocuments();
    const doctorsCount = await Doctor.countDocuments();
    const adminsCount = await Admin.countDocuments();
    res.json({ users: usersCount, doctors: doctorsCount, admins: adminsCount });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

export const getGenderStats = async (req, res) => {
  try {
    const maleCount = await User.countDocuments({ gender: 'Male' });
    const femaleCount = await User.countDocuments({ gender: 'Female' });
    res.json({ male: maleCount, female: femaleCount });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

export const getMonthlyRegistrations = async (req, res) => {
  try {
    const users = await User.find();
    const monthlyData = Array(12).fill(0);

    users.forEach(user => {
      const month = new Date(user.createdAt).getMonth();
      monthlyData[month]++;
    });

    res.json({ monthlyData });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    const usersWithStatus = users.map(user => {
      const lastSeen = new Date(user.updatedAt);
      const now = new Date();
      const diffInDays = Math.floor((now - lastSeen) / (1000 * 60 * 60 * 24));

      const status = diffInDays > 7 ? 'Inactive' : 'Active'; 

      return {
        ...user._doc,
        status,
        lastSeen, 
      };
    });

    res.status(200).json({ success: true, data: usersWithStatus });
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};




export const createUser = async (req, res) => {
  try {
    const {
      firstName, lastName, email, password,
      phoneNumber, gender, birthday, weight, diabetesType
    } = req.body;

    if (!firstName || !lastName || !email || !password || !gender || !phoneNumber || !birthday) {
      return res.status(400).json({ message: 'Please fill all required fields.' });
    }

    const newUser = new User({
      firstName,
      lastName,
      userName: firstName + lastName, 
      email,
      password,
      rePassword: password,
      phoneNumber,
      gender,
      birthday,
      weight,
      diabetesType,
    });

    await newUser.save();
    res.status(201).json({ message: 'User created successfully.' });

  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const user = await User.findByIdAndUpdate(id, updatedData, { new: true });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.json({ message: 'User updated successfully.', user });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.json({ message: 'User deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

export const createDoctor = async (req, res) => {
  try {
    const {
      firstName, lastName, email, password,
      phoneNumber, gender, birthday, medicalSpecialty, experience
    } = req.body;

    if (!firstName || !lastName || !email || !password || !phoneNumber || !gender || !birthday || !medicalSpecialty) {
      return res.status(400).json({ message: 'Please fill all required fields.' });
    }

    const newDoctor = new Doctor({
      firstName,
      lastName,
      userName: firstName + lastName,
      email,
      password,
      rePassword: password,
      phoneNumber,
      gender,
      birthday,
      medicalSpecialty,
      experience: experience || '0',
    });

    await newDoctor.save();
    res.status(201).json({ message: 'Doctor created successfully.' });
  } catch (error) {
    console.error('Create doctor error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

export const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find();
    
    const doctorsWithStatus = doctors.map(doctor => {
      const lastSeen = new Date(doctor.updatedAt); 
      const now = new Date();
      const diffInDays = Math.floor((now - lastSeen) / (1000 * 60 * 60 * 24));

      const status = diffInDays > 7 ? 'Inactive' : 'Active';

      return {
        ...doctor._doc,
        status,
        lastSeen, 
      };
    });

    res.json(doctorsWithStatus);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};



export const updateDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedDoctor = await Doctor.findByIdAndUpdate(id, req.body, { new: true });

    if (!updatedDoctor) {
      return res.status(404).json({ message: 'Doctor not found.' });
    }

    res.json({ message: 'Doctor updated successfully.' });
  } catch (error) {
    console.error('Update doctor error:', error);
    res.status(500).json({ message: 'Server Error', error });
  }
};

export const deleteDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedDoctor = await Doctor.findByIdAndDelete(id);

    if (!deletedDoctor) {
      return res.status(404).json({ message: 'Doctor not found.' });
    }

    res.json({ message: 'Doctor deleted successfully.' });
  } catch (error) {
    console.error('Delete doctor error:', error);
    res.status(500).json({ message: 'Server Error', error });
  }
};


export const getGenderRegistrationStats = async (req, res) => {
  try {
    const users = await User.find();
    const doctors = await Doctor.find();

    let malePatients = 0;
    let femalePatients = 0;
    let maleDoctors = 0;
    let femaleDoctors = 0;

    users.forEach(user => {
      if (user.gender === 'Male') malePatients++;
      else if (user.gender === 'Female') femalePatients++;
    });

    doctors.forEach(doctor => {
      if (doctor.gender === 'Male') maleDoctors++;
      else if (doctor.gender === 'Female') femaleDoctors++;
    });

    res.json({
      malePatients,
      femalePatients,
      maleDoctors,
      femaleDoctors
    });
  } catch (error) {
    console.error('Get gender stats error:', error);
    res.status(500).json({ message: 'Server Error', error });
  }
};
  
export const getMonthlyGenderRegistrations = async (req, res) => {
  try {
    const { year } = req.query;
    const startOfYear = new Date(`${year}-01-01T00:00:00.000Z`);
    const endOfYear = new Date(`${Number(year) + 1}-01-01T00:00:00.000Z`);

    const users = await User.find({
      createdAt: { $gte: startOfYear, $lt: endOfYear }
    });

    const doctors = await Doctor.find({
      createdAt: { $gte: startOfYear, $lt: endOfYear }
    });

    const monthlyData = {
      malePatients: Array(12).fill(0),
      femalePatients: Array(12).fill(0),
      maleDoctors: Array(12).fill(0),
      femaleDoctors: Array(12).fill(0),
    };

    users.forEach(user => {
      const month = new Date(user.createdAt).getMonth();
      if (user.gender === 'Male') {
        monthlyData.malePatients[month]++;
      } else if (user.gender === 'Female') {
        monthlyData.femalePatients[month]++;
      }
    });

    doctors.forEach(doctor => {
      const month = new Date(doctor.createdAt).getMonth();
      if (doctor.gender === 'Male') {
        monthlyData.maleDoctors[month]++;
      } else if (doctor.gender === 'Female') {
        monthlyData.femaleDoctors[month]++;
      }
    });

    res.json(monthlyData);
  } catch (error) {
    console.error('Error in getMonthlyGenderRegistrations:', error);
    res.status(500).json({ message: 'Server Error', error });
  }
};
