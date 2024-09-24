const { response } = require('express');
const config = require('../config/config');
const mysql2 = require('mysql2');

const db = mysql2.createConnection({
    host: config.host,
    user: config.username,
    password: config.password,
    database: config.database
});

db.connect((err) => {
    if (err) {
        console.error("Error connecting to database:", err);
        process.exit(1); // Exit the application if the database connection fails
    }
    console.log("Successfully connected to the database");
});

// User Signup
exports.signUp = (user, callback) => {
    const query = "INSERT INTO users (username, password, securitycode) VALUES (?, ?, ?)";
    db.query(query, [user.username, user.password, user.securitycode], (err, results) => {
        if (err) {
            callback(err, null);
        } else if (results.affectedRows > 0) {
            return callback(null, { success: true, message: 'User registered successfully' });
        } else {
            return callback(null, { success: false, message: 'Unable to register the user' });
        }
    });
};

// User Login
exports.userLogin = (user, callback) => {
    const { username, password, securitycode } = user;
    const query = "SELECT * FROM users WHERE username = ? AND password = ? AND securitycode = ?";
    
    db.query(query, [username, password, securitycode], (err, results) => {
        if (err) {
            console.error(err);
            return callback(err, null);
        }

        if (results.length > 0) {
            return callback(null, { success: true, message: 'Login successful' });
        } else {
            return callback(null, { success: false, message: 'Invalid credentials' });
        }
    });
};

// Admin Login
exports.adminLogin = (username, password, callback) => {
    const query = 'SELECT * FROM admin WHERE username = ? AND password = ?';
    
    db.query(query, [username, password], (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return callback(err, null); 
        }

        if (results.length > 0) {
            callback(null, { success: true });
        } else {
            callback(null, { success: false });
        }
    });
};

// CRUD Operations on Users

// Get All Users
exports.getUsers = (callback) => {
    const query = "SELECT * FROM users";
    db.query(query, callback);
};

// Get User by ID
exports.getUserById = (id, callback) => {
    const query = "SELECT * FROM users WHERE id = ?";
    db.query(query, [id], (err, result) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, result);
        }
    });
};

// Update User
exports.updateUser = (id, user, callback) => {
    const query = "UPDATE users SET username = ?, password = ?, securitycode = ? WHERE id = ?";
    db.query(query, [user.username, user.password, user.securitycode, id], (err, results) => {
        if (err) {
            callback(err, null);
        } else if (results.affectedRows === 0) {
            callback(new Error("No user found with the given ID"), null);
        } else {
            callback(null, results);
        }
    });
};

// Delete User
exports.deleteUser = (id, callback) => {
    const query = "DELETE FROM users WHERE id = ?";
    db.query(query, [id], (err, results) => {
        if (err) {
            callback(err, null);
        } else if (results.affectedRows === 0) {
            callback(new Error("No user found with the given ID"), null);
        } else {
            callback(null, results);
        }
    });
};

// CRUD Operations on Benefits

// Add Benefit
exports.addBenefits = (benefit, callback) => {
    const query = `
        INSERT INTO benefits (benefit_name, description, eligibility_criteria, coverage_amount, start_date, end_date)
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    db.query(query, [
        benefit.benefit_name,
        benefit.description,
        benefit.eligibility_criteria,
        benefit.coverage_amount,
        benefit.start_date,
        benefit.end_date
    ], (err, result) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, result);
        }
    });
};

// Get All Benefits
exports.getBenefits = (callback) => {
    db.query("SELECT * FROM benefits", callback);
};

// Get Benefit by ID
exports.getBenefitsById = (id, callback) => {
    const query = "SELECT * FROM benefits WHERE id = ?";
    db.query(query, [id], (err, result) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, result);
        }
    });
};

// Update Benefit
exports.updateBenefits = (id, benefit, callback) => {
    const query = `
        UPDATE benefits SET 
        benefit_name = ?, 
        description = ?, 
        eligibility_criteria = ?, 
        coverage_amount = ?, 
        start_date = ?, 
        end_date = ? 
        WHERE id = ?
    `;
    const values = [
        benefit.benefit_name, 
        benefit.description, 
        benefit.eligibility_criteria, 
        benefit.coverage_amount, 
        benefit.start_date, 
        benefit.end_date, 
        id
    ];

    db.query(query, values, (err, result) => {
        if (err) {
            callback(err, null);
        } else if (result.affectedRows === 0) {
            callback(new Error("No benefit found with the given ID"), null);
        } else {
            callback(null, result);
        }
    });
};

// Delete Benefit
exports.deleteBenefit = (id, callback) => {
    const query = "DELETE FROM benefits WHERE id = ?";
    db.query(query, [id], (err, result) => {
        if (err) {
            callback(err, null);
        } else if (result.affectedRows === 0) {
            callback(new Error("No benefit found with the given ID"), null);
        } else {
            callback(null, result);
        }
    });
};

// User Inventory

// Get Inventory by User ID
exports.getInventory = (id, callback) => {
    const query = `
        SELECT * FROM benefits b 
        INNER JOIN inventory i ON i.benefitsID = b.id 
        WHERE i.user_id = ?
    `;
    db.query(query, [id], (err, result) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, result);
        }
    });
};

// Add Inventory for a User


exports.deleteFromInventory = (id, callback) => {
    const query = "DELETE FROM inventory WHERE id = ?";
    db.query(query, [id], (err, result) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, result);
        }
    });
};

// Request Handling



exports.addBenefitRequest = (request, callback) => {
    const query = "INSERT INTO requestBenefits (user_id, benefitsID) VALUES (?,?)";
    
    db.query(query, [request.user_id, request.benefitsID], (err, result) => {
        if (err) {
            return callback(err, null);
        }
        if (result.affectedRows > 0) {
            return callback(null, { success: true, message: 'Request inserted successfully' });
        } else {
            return callback(null, { success: false, message: 'Unable to insert the request' });
        }
    });
};

exports.addToInventory = (userid, benefitsID, callback) => {
    const query = "INSERT INTO inventory (user_id, benefitsID) VALUES (?, ?)";
    db.query(query, [userid, benefitsID], (err, result) => {
        if (err) {
            console.error(err);
            callback(err, null);
        } else if (result.affectedRows > 0) {
            return callback(null, { success: true, message: 'Insertion to inventory successful' });
        } else {
            return callback(null, { success: false, message: 'Unable to add to inventory' });
        }
    });
};
exports.updateBenefitRequest = (id, request, callback) => {
    const query = "UPDATE requestBenefits SET status = ? WHERE id = ?";
    console.log(request);
    db.query(query, [request.status, id], (err, result) => {
        if (err) {
            return callback(err, null);
        } else {
            if (request.status === "accepted") {
                this.addToInventory(request.user_id, request.benefitsID, (err) => {
                    if (err) {
                        return callback(err, null);
                    }
                    
                    callback(null, "accepted");
                });
            } else {
                callback(null, "rejected");
            }
        }
    });
};

exports.deleteBenefitRequest = (id, callback) => {
    const query = "DELETE FROM requestBenefits WHERE id = ?";

    db.query(query, [id], (err, result) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, result);
        }
    });
};
exports.getBenefitRequest =(callback)=>{
    const query = "SELECT * FROM requestBenefits";
    db.query(query, callback);
}
exports.getUserRequest =(callback)=>{
    const query = "SELECT * FROM requestusers";
    db.query(query, callback);
}
exports.addUserRequest = (request, callback) => {
    const query = "INSERT INTO requestusers (username, password, securitycode, status) VALUES (?, ?, ?, ?)";

    db.query(query, [request.username, request.password, request.securitycode, "pending"], (err, result) => {
        if (err) {
            console.error(err);
            return callback(err, null);
        }
        if (result) {
            return callback(null, { success: true, message: 'Request inserted successfully' });
        } else {
            return callback(null, { success: false, message: 'Unable to insert the request' });
        }
    });
};

exports.updateUserRequest = (id, request, callback) => {
    const query = "UPDATE requestusers SET status = ? WHERE id = ?";

    db.query(query, [request.status, id], (err, result) => {
        if (err) {
            return callback(err, null);
        } else {
            if (request.status === "accepted") {
                this.signUp({ username: request.username, password: request.password, securitycode: request.securitycode }, (err) => {
                    if (err) {
                        return callback(err, null);
                    }
                    callback(null, "accepted");
                });
            } else {
                callback(null, "rejected");
            }
        }
    });
};

exports.deleteUserRequest = (id, callback) => {
    const query = "DELETE FROM requestusers WHERE id = ?";

    db.query(query, [id], (err, result) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, result);
        }
    });
};
