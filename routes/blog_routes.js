import express from 'express';
import {
    addBlog,
    deleteBlog,
    getAllBlogs,
    getById,
    getByUserId,
    updateBlog,
} from '../controllers/blog_controllers';

const router = express.Router();

router.route('/').get(getAllBlogs);
router.route('/add').post(addBlog);
router.route('/update/:id').put(updateBlog);
router.route('/:id').get(getById);
router.route('/delete/:id').delete(deleteBlog);
router.route('/user/:id').get(getByUserId);

export default router;
