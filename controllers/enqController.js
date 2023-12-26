// controllers/enquiryController.js

import asyncHandler from 'express-async-handler';
import Enquiry from '../models/enqModel.js';
import { validateMongoID } from '../utils/validateMongoId.js';

// @desc    Get all enquiries
// @route   GET /api/enquiries

export const getEnquiries = asyncHandler(async (req, res) => {
  const enquiries = await Enquiry.find();
  
  res.json(enquiries);
});

// @desc    Get single enquiry  
// @route   GET /api/enquiries/:id

export const getEnquiryById = asyncHandler(async (req, res) => {
  const enquiry = await Enquiry.findById(req.params.id);
  validateMongoID(enquiry);

  if(!enquiry) {
    res.status(404);
    throw new Error('Enquiry not found');
  }

  res.json(enquiry);
});

// @desc    Create an enquiry
// @route   POST /api/enquiries
// @access  Public
export const createEnquiry = asyncHandler(async (req, res) => {
  const enquiry = await Enquiry.create(req.body);
  
  res.status(201).json(enquiry); 
});

// @desc    Update an enquiry
// @route   PUT /api/enquiries/:id

export const updateEnquiry = asyncHandler(async (req, res) => {
  const enquiry = await Enquiry.findByIdAndUpdate(req.params.id, req.body, {
    new: true
  });

  if(!enquiry) {
    res.status(404);
    throw new Error('Enquiry not found');
  }

  res.json(enquiry);
}); 

// @desc    Delete an enquiry
// @route   DELETE /api/enquiries/:id
 
export const deleteEnquiry = asyncHandler(async (req, res) => {
  const enquiry = await Enquiry.findByIdAndDelete(req.params.id);

  if(!enquiry) {
    res.status(404);
    throw new Error('Enquiry not found');
  }

  res.json({ message: 'Enquiry removed' });
});


