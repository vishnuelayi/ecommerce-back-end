// routes/enquiryRoutes.js

import express from 'express';
import { authMiddleware, isAdmin } from '../middlewares/authMiddleware.js';
import { 
  getEnquiries,
  getEnquiryById,
  createEnquiry,
  updateEnquiry,
  deleteEnquiry
} from '../controllers/enqController.js';

const router = express.Router();

// @desc    Get all enquiries
// @route   GET /api/enquiries
// @access  Public
router.get('/', authMiddleware, isAdmin,getEnquiries);

// @desc    Get single enquiry
// @route   GET /api/enquiries/:id
// @access  Public  
router.get('/:id', authMiddleware, getEnquiryById);

// @desc    Create enquiry
// @route   POST /api/enquiries
// @access  Public
router.post('/', createEnquiry);

// @desc    Update enquiry
// @route   PUT /api/enquiries/:id
 
router.put('/:id',authMiddleware,isAdmin, updateEnquiry);

// @desc    Delete enquiry
// @route   DELETE /api/enquiries/:id
// @access  Public
router.delete('/:id',authMiddleware,isAdmin, deleteEnquiry);

export default router;
