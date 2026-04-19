const User = require('../models/User');
const bcrypt = require('bcryptjs');

// GET / — ambil semua user
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.status(200).json({ success: true, total: users.length, data: users });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// GET /:id — ambil user by ID
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) return res.status(404).json({ success: false, message: 'User tidak ditemukan' });
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// POST / — tambah user baru
const createUser = async (req, res) => {
    try {
        const { email, username, password, is_active } = req.body;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = await User.create({ email, username, password: hashedPassword, is_active });
        const { password: _, ...userData } = user.toObject();
        res.status(201).json({ success: true, message: 'User berhasil dibuat', data: userData });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// PUT /:id — update user
const updateUser = async (req, res) => {
    try {
        const { password, ...updateData } = req.body;
        if (password) {
            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(password, salt);
        }
        const user = await User.findByIdAndUpdate(req.params.id, updateData, { new: true }).select('-password');
        if (!user) return res.status(404).json({ success: false, message: 'User tidak ditemukan' });
        res.status(200).json({ success: true, message: 'User berhasil diupdate', data: user });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// DELETE /:id — hapus user
const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ success: false, message: 'User tidak ditemukan' });
        res.status(200).json({ success: true, message: 'User berhasil dihapus' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { getAllUsers, getUserById, createUser, updateUser, deleteUser };