const Paste = require('../models/Paste');
const User = require('../models/User');
const { getSinglePaste } = require('./pasteController');

const getPastes = async (req, res) => {
  try {
    const { userId } = req.body;

    // Retrieve all pastes from the database using the Paste model
    const user = await User.findOne({_id : userId});

    console.log(userId);
    console.log(user.pastes);

    res.status(200).json(user.pastes);
  } catch (error) {
    res.status(500).json({ error: 'Invalid user' });
  }
};

module.exports = {
	getPastes
};