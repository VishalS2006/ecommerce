import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Cart from '../models/Cart.js';
import Wishlist from '../models/Wishlist.js';

// Send response with token
const sendTokenResponse = (user, statusCode, res, message = 'Success') => {
  const token = user.getSignedJwtToken();

  res.status(statusCode).json({
    success: true,
    message,
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      role: user.role,
      status: user.status,
      addresses: user.addresses
    }
  });
};

// @desc    Register customer
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
  try {
    const { name, email, mobile, password, confirmPassword } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide full name, email and password'
      });
    }

    if (confirmPassword && password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    // Check if user exists
    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      mobile: mobile || '',
      passwordHash,
      role: 'customer'
    });

    // Create initial cart and wishlist for user
    await Cart.create({ user: user._id, items: [] });
    await Wishlist.create({ user: user._id, products: [] });

    sendTokenResponse(user, 201, res, 'Registration successful! Welcome to ShopSphere.');
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an email and password'
      });
    }

    // Check for user
    const user = await User.findOne({ email: email.toLowerCase() }).select('+passwordHash');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if active
    if (user.status !== 'active') {
      return res.status(403).json({
        success: false,
        message: 'Account is deactivated. Please contact support.'
      });
    }

    sendTokenResponse(user, 200, res, 'Logged in successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user details
// @route   PUT /api/auth/updatedetails
// @access  Private
export const updateDetails = async (req, res, next) => {
  try {
    const { name, mobile } = req.body;

    const fieldsToUpdate = {};
    if (name) fieldsToUpdate.name = name;
    if (mobile !== undefined) fieldsToUpdate.mobile = mobile;

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update password
// @route   PUT /api/auth/updatepassword
// @access  Private
export const updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide current and new password'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long'
      });
    }

    const user = await User.findById(req.user.id).select('+passwordHash');

    // Check current password
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(newPassword, salt);
    await user.save();

    sendTokenResponse(user, 200, res, 'Password changed successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Add delivery address
// @route   POST /api/auth/addresses
// @access  Private
export const addAddress = async (req, res, next) => {
  try {
    const {
      fullName,
      mobile,
      addressLine1,
      addressLine2,
      city,
      state,
      postalCode,
      country,
      addressType,
      isDefault
    } = req.body;

    if (!fullName || !mobile || !addressLine1 || !city || !state || !postalCode) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required address fields'
      });
    }

    const user = await User.findById(req.user.id);

    // If first address or marked default, unset other defaults
    if (isDefault || user.addresses.length === 0) {
      user.addresses.forEach(addr => (addr.isDefault = false));
    }

    user.addresses.push({
      fullName,
      mobile,
      addressLine1,
      addressLine2: addressLine2 || '',
      city,
      state,
      postalCode,
      country: country || 'India',
      addressType: addressType || 'Home',
      isDefault: isDefault || user.addresses.length === 0
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: 'Address added successfully',
      addresses: user.addresses
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update delivery address
// @route   PUT /api/auth/addresses/:addressId
// @access  Private
export const updateAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const address = user.addresses.id(req.params.addressId);

    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Address not found'
      });
    }

    if (req.body.isDefault) {
      user.addresses.forEach(addr => (addr.isDefault = false));
    }

    Object.assign(address, req.body);
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Address updated successfully',
      addresses: user.addresses
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete delivery address
// @route   DELETE /api/auth/addresses/:addressId
// @access  Private
export const deleteAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    user.addresses.pull({ _id: req.params.addressId });
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Address deleted successfully',
      addresses: user.addresses
    });
  } catch (error) {
    next(error);
  }
};
