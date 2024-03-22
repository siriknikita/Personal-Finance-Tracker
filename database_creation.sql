DROP DATABASE PFT;
CREATE DATABASE PFT;
USE PFT;

-- Create the Users table
CREATE TABLE IF NOT EXISTS Users (
    UserID INT AUTO_INCREMENT PRIMARY KEY,
    Username VARCHAR(255) NOT NULL,
    Email VARCHAR(255) NOT NULL UNIQUE,
    PasswordHash VARCHAR(255) NOT NULL,
    TotalSpent DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    WeeklySpent DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    RegistrationDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create the Categories table
CREATE TABLE IF NOT EXISTS Categories (
    CategoryID INT AUTO_INCREMENT PRIMARY KEY,
    CategoryName VARCHAR(50) NOT NULL
);

-- Insert some sample categories
INSERT INTO Categories (CategoryName) VALUES
('Groceries'),
('Utilities'),
('Rent'),
('Entertainment'),
('Healthcare'),
('Transportation'),
('Other');

-- Create the Transactions table
CREATE TABLE IF NOT EXISTS Transactions (
    TransactionID INT AUTO_INCREMENT PRIMARY KEY,
    UserID INT,
    Amount DECIMAL(10, 2) NOT NULL,
    CategoryID INT,
    TransactionDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (UserID) REFERENCES Users(UserID),
    FOREIGN KEY (CategoryID) REFERENCES Categories(CategoryID)
);

-- Create a Table to manage current user budget
-- User selects a category and for each category we define an amount of money he want to spread on.
CREATE TABLE IF NOT EXISTS Budget (
	UserID INT,
    CategoryID INT DEFAULT 1,
    Amount DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    FOREIGN KEY (UserID) REFERENCES Users(UserID),
    FOREIGN KEY (CategoryID) REFERENCES Categories(CategoryID)
);

-- Create a Table to manage user's goals
CREATE TABLE IF NOT EXISTS Goals (
	UserID INT,
    GoalDescription TEXT,
    Deadline DATETIME,
	FOREIGN KEY (UserID) REFERENCES Users(UserID)
);

SELECT * FROM Users;
SELECT * FROM Transactions;
SELECT * FROM Categories;
