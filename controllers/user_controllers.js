import User from '../models/User';
import bcrypt from 'bcryptjs';

export const getAllUser = async (req, res) => {
    let users;
    try {
        users = await User.find({});
    } catch (error) {
        console.log(error);
    }
    if (!users) {
        return res
            .status(404)
            .json({ success: false, message: 'No users found' });
    } else {
        return res.status(200).json({ success: true, data: users });
    }
};

export const signUp = async (req, res) => {
    const { name, email, password } = req.body;

    let existingUser;
    try {
        existingUser = await User.findOne({ email });
    } catch (error) {
        console.log(error);
    }
    if (existingUser) {
        return res.status(200).json({
            success: false,
            message: 'User already exists! Login instead!',
        });
    }
    const hashedPassword = bcrypt.hashSync(password);
    const user = new User({ name, email, password: hashedPassword, blogs: [] });

    try {
        await user.save();
    } catch (error) {
        console.log(error);
    }
    return res.status(201).json({ status: true, data: user });
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    let existingUser;
    try {
        existingUser = await User.findOne({ email });
    } catch (error) {
        console.log(error);
    }
    if (!existingUser) {
        return res.status(404).json({
            success: false,
            message: "Couldn't find user with this email id",
        });
    }

    const isPasswordCorrect = bcrypt.compareSync(
        password,
        existingUser.password
    );

    if (!isPasswordCorrect) {
        return res
            .status(404)
            .json({ success: false, message: 'Incorrect Password' });
    }
    return res.status(200).json({ success: true, message: 'Login Successful' });
};
