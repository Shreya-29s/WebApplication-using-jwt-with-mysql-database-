-- Users Table
CREATE TABLE Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    securitycode VARCHAR(255) NOT NULL
);

-- Admin Table
CREATE TABLE Admin (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

-- Benefits Table
CREATE TABLE Benefits (
    id INT AUTO_INCREMENT PRIMARY KEY,
    benefit_name VARCHAR(255) NOT NULL,
    description TEXT,
    eligibility_criteria TEXT,
    coverage_amount DECIMAL(10, 2),
    start_date DATE,
    end_date DATE
);
-- Insert sample data into Users table
INSERT INTO Users (username, password, securitycode) VALUES
('john_doe', 'password123', 'abc123'),
('jane_smith', 'securepass', 'xyz789'),
('alice_jones', 'mypassword', 'lmn456');

-- Insert sample data into Admin table
INSERT INTO Admin (username, password) VALUES
('admin1', 'adminpass1'),
('admin2', 'adminpass2');

-- Insert sample data into Benefits table
INSERT INTO Benefits (benefit_name, description, eligibility_criteria, coverage_amount, start_date, end_date) VALUES
('Health Insurance', 'Comprehensive health coverage including doctor visits and hospital stays.', 'Must be employed full-time.', 1000.00, '2024-01-01', '2024-12-31'),
('Retirement Plan', 'A retirement savings plan with employer contributions.', 'Must have been employed for at least 1 year.', 5000.00, '2024-01-01', '2024-12-31'),
('Gym Membership', 'Monthly gym membership at a local fitness center.', 'Must be a full-time employee.', 50.00, '2024-01-01', '2024-06-30');

CREATE TABLE inventory (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        benefitsID INT,
        FOREIGN KEY (user_id) REFERENCES users(id)
    );
CREATE TABLE requestBenefits (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    benefitsID INT NOT NULL,
    status ENUM('pending', 'Accepted', 'Rejected') DEFAULT 'pending',
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (benefitsID) REFERENCES benefits(id)
);
CREATE TABLE requestusers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    -- user_id INT NOT NULL,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    securitycode VARCHAR(255) NOT NULL,
    status ENUM('pending', 'Accepted', 'Rejected') DEFAULT 'pending'
    -- FOREIGN KEY (user_id) REFERENCES users(id)
);
