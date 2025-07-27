const UserModel = require('../Models_db/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const signup = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const user = await UserModel.findOne({ email });
        if (user) {
            return res.status(409).json({ message: 'User already exists, you can login', success: false });
        }
        const userModel = new UserModel({ username, email, password });
        userModel.password = await bcrypt.hash(password, 10);
        await userModel.save();
        res.status(201).json({ message: 'Signup successful', success: true });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', success: false });
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email });
        const errorMessage = 'Auth failed email or password is wrong';
        if (!user) {
            return res.status(403).json({ message: errorMessage, success: false });
        }
        const isPassEqual = await bcrypt.compare(password, user.password);
        if (!isPassEqual) {
            return res.status(403).json({ message: errorMessage, success: false });
        }
        const jwtToken = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
        res.status(200).json({ message: 'Login successful', success: true, jwtToken, email, username: user.username });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', success: false });
    }
}

module.exports = {
    signup,
    login
}