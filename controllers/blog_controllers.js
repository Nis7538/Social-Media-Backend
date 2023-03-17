import Blog from '../models/Blog';
import User from '../models/User';
import mongoose from 'mongoose';

export const getAllBlogs = async (req, res) => {
    let blogs;
    try {
        blogs = await Blog.find({});
    } catch (error) {
        return console.log(error);
    }

    if (!blogs) {
        return res
            .status(404)
            .json({ success: false, message: 'No blogs found' });
    }

    return res.status(200).json({ success: true, data: blogs });
};

export const addBlog = async (req, res) => {
    const { title, description, image, user } = req.body;
    const blog = new Blog({ title, description, image, user });

    let existingUser;
    try {
        existingUser = await User.findById(user);
    } catch (error) {
        return console.log(error);
    }

    if (!existingUser) {
        return res.status(500).json({
            success: false,
            message: 'User with this ID does not exist',
        });
    }

    try {
        const session = await mongoose.startSession();
        session.startTransaction();
        await blog.save({ session });
        existingUser.blogs.push(blog);
        await existingUser.save({ session });
        await session.commitTransaction();
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: error });
    }

    return res.status(200).json({ success: true, data: blog });
};

export const updateBlog = async (req, res) => {
    const { title, description } = req.body;
    const blogId = req.params.id;
    let blog;
    try {
        blog = await Blog.findByIdAndUpdate(
            blogId,
            {
                title,
                description,
            },
            {
                runValidators: true,
                new: true,
            }
        );
    } catch (error) {
        console.log(error);
    }
    if (!blog) {
        return res
            .status(500)
            .json({ success: false, message: 'Blog not found' });
    }
    return res.status(200).json({ success: true, data: blog });
};

export const getById = async (req, res) => {
    const blogId = req.params.id;
    let blog;
    try {
        blog = await Blog.findById(blogId);
    } catch (error) {
        return console.log(error);
    }

    if (!blog) {
        return res
            .status(500)
            .json({ success: false, message: 'Blog not found' });
    }

    return res.status(200).json({ success: true, data: blog });
};

export const deleteBlog = async (req, res) => {
    const blogId = req.params.id;
    let blog;
    try {
        blog = await Blog.findByIdAndDelete(blogId).populate('user');
        await blog.user.blogs.pull(blog);
        await blog.user.save();
    } catch (error) {
        return console.log(error);
    }

    if (!blog) {
        return res
            .status(500)
            .json({ success: false, message: 'Blog not found' });
    }

    return res.status(200).json({
        success: true,
        message: 'Blog deleted successfully!',
        data: {},
    });
};

export const getByUserId = async (req, res) => {
    let userBlogs;
    const userId = req.params.id;
    try {
        userBlogs = await User.findById(userId).populate('blogs');
    } catch (error) {
        return console.log(error);
    }

    if (!userBlogs) {
        return res
            .status(500)
            .json({ success: false, message: 'Blogs not found!' });
    }
    return res.status(200).json({ success: true, data: userBlogs });
};
