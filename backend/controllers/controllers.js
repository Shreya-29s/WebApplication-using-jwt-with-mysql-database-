const { response } = require('express');
const models = require('../models/models');
const jwt = require('jsonwebtoken');
const key = "benefitsauthenticate";

// Middleware for User Authentication
exports.authenticateUser = (req, res, next) => {
    const authToken = req.headers['authorization'];
    // console.log(req.headers,authToken);
    if (!authToken) return res.status(401).json({ message: 'Authorization token required' });

    try {
        const decoded = jwt.verify(authToken, key);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};

function generateToken(user) {
    const payload = {
        id: user.id,
        username: user.username,
    };

    const token = jwt.sign(payload, key, { expiresIn: '1h' });
    return token;
}

// User SignUp
exports.signUp = (req, res) => {
    const user = req.body;
    
    models.signUp(user, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: 'Error registering user' });
        } else {
            const token = generateToken(user); // Generate token after successful registration
            res.status(201).json({ message: 'User created', token, data: result });
        }
    });
};

// User Login
exports.userLogin = (req, res) => {
    const user = req.body;
    
    models.userLogin(user, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: 'Error logging in user' });
        }
        if (result.success) {
            const token = generateToken(user); // Generate token after successful login
            res.status(200).json({ token, data: result });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    });
};

// Admin Login
exports.adminLogin = (req, res) => {
    const { username, password } = req.body;
    // res.status(200).send("adminLogin");
    models.adminLogin(username, password, (err, result) => {
        if (err) {
            console.error("Error while logging admin", err);
            return res.status(500).json({ success: false, message: "Error while logging admin" });
        }
        else if (result.success) {
            const token = generateToken({ username }); // Generate token if needed for admin
            res.status(200).json({ token, result });
        } else {
            res.status(401).json({ message: 'Invalid credentials',result});
        }
    });
};

// CRUD Operations on Users

// Get All Users
exports.getUsers = (req, res) => {
    models.getUsers((err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'Error fetching users' });
        } else {
            res.status(200).json(result);
        }
    });
};

// Get User by ID
exports.getUserById = (req, res) => {
    const id = req.params.id;
    models.getUserById(id, (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'Error fetching user' });
        } else {
            res.status(200).json(result);
        }
    });
};

// Update User
exports.updateUser = (req, res) => {
    const id = req.params.id;
    const user = req.body;
    models.updateUser(id, user, (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'Error updating user' });
        } else {
            res.status(200).json(result);
        }
    });
};

// Delete User
exports.deleteUser = (req, res) => {
    const id = req.params.id;
    models.deleteUser(id, (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'Error deleting user' });
        } else {
            res.status(200).json(result);
        }
    });
};

// CRUD Operations on Benefits

// Add Benefit
exports.addBenefit = (req, res) => {
    const benefit = req.body;
    models.addBenefits(benefit, (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'Error adding benefit' });
        } else {
            res.status(201).json(result);
        }
    });
};

// Get All Benefits
exports.getBenefits = (req, res) => {
    models.getBenefits((err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'Error fetching benefits' });
        } else {
            res.status(200).json(result);
        }
    });
};

// Get Benefit by ID
exports.getBenefitsById = (req, res) => {
    const id = req.params.id;
    models.getBenefitsById(id, (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'Error fetching benefit' });
        } else {
            res.status(200).json(result);
        }
    });
};

// Update Benefit
exports.updateBenefits = (req, res) => {
    const id = req.params.id;
    const benefit = req.body;
    models.updateBenefits(id, benefit, (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'Error updating benefit' });
        } else {
            res.status(200).json(result);
        }
    });
};

// Delete Benefit
exports.deleteBenefit = (req, res) => {
    const id = req.params.id;
    models.deleteBenefit(id, (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'Error deleting benefit' });
        } else {
            res.status(200).json(result);
        }
    });
};

// User Inventory

// Get Inventory by User ID
exports.getInventory = (req, res) => {
    const userId = req.params.id;
    models.getInventory(userId, (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'Error fetching inventory' });
        } else {
            res.status(200).json(result);
        }
    });
};

// Add to Inventory
exports.addToInventory = (req, res) => {
    const inventory = req.body;
    const userId = req.params.id;
    models.addToInventory(userId, inventory, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: 'Error adding to inventory' });
        } else {
            res.status(201).json(result);
        }
    });
};

// Delete from Inventory
exports.deleteToInventory = (req, res) => {
    const id = req.params.id;
    models.deleteFromInventory(id, (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: "Error deleting inventory item" });
        } else {
            res.status(200).json(result);
        }
    });
};

// Request Management

// Add Benefit Request

exports.getBenefitRequest =(req,res)=>{
    models.getBenefitRequest( (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).json({ success: false, message: 'Error adding the request' });
        } else {
            res.status(200).json(result);
        }
    });
}
exports.addBenefitRequest = (req, res) => {
    const request = req.body;
    
    models.addBenefitRequest(request, (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).json({ success: false, message: 'Error adding the request' });
        } else {
            res.status(200).json({ success: true, message: 'Successfully added the request', data: result });
        }
    });
};


// Update Benefit Request
exports.updateBenefitRequest = (req, res) => {
    const id = req.params.id;
    const request = req.body;

    models.updateBenefitRequest(id, request, (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'Error updating the request', error: err });
        } else {
            res.status(200).json({ message: 'Request status updated' });
        }
    });
};

// Delete Benefit Request
exports.deleteBenefitRequest = (req, res) => {
    const id = req.params.id;
    models.deleteBenefitRequest(id, (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'Error deleting the request' });
        } else {
            res.status(200).json({ message: 'Deleted the request', data: result });
        }
    });
};

exports.getUserRequest =(req,res)=>{
    models.getUserRequest( (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).json({ success: false, message: 'Error adding the request' });
        } else {
            res.status(200).json(result);
        }
    });
}
// Add User Request
exports.addUserRequest = (req, res) => {
    const request = req.body;
    models.addUserRequest(request, (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ success: false, message: 'Error adding the request' });
        } else {
            res.status(200).json({ success: true, message: 'Successfully added the request', data: result });
        }
    });
};

// Update User Request
exports.updateUserRequest = (req, res) => {
    const id = req.params.id;
    const request = req.body;

    models.updateUserRequest(id, request, (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'Error updating the request', error: err });
        } else {
            res.status(200).json({ message: 'Request status updated' });
        }
    });
};

// Delete User Request
exports.deleteUserRequest = (req, res) => {
    const id = req.params.id;
    models.deleteUserRequest(id, (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'Error deleting the request' });
        } else {
            res.status(200).json({ message: 'Deleted the request', data: result });
        }
    });
};
