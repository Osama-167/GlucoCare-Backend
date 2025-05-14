import Note from "../models/note.js";



export const getMessages = async (req, res) => {

  const { doctorId, userId } = req.query;

  if (!doctorId || !userId) {
    return res.status(400).json({ message: "Missing doctorId or userId" });
  }

  try {
    const messages = await Note.find({
      doctor: doctorId,
      user: userId,
    }).sort({ createdAt: 1 });

    res.status(200).json({ messages });
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  console.log(req.body)
  const { doctorId, userId, senderId, content } = req.body;

  if (!doctorId || !userId || !senderId || !content) {
    return res.status(400).json({ message: "Missing fields" });
  }

  try {
    const note = new Note({
      doctor: doctorId,
      user: userId,
      senderId,
      content,
      createdAt: new Date(),
    });

    await note.save();

    res.status(200).json({ message: "Message sent", note });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
