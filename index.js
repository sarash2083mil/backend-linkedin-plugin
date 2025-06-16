require('dotenv').config();
const express = require('express');
const app = express();
const PORT = 3000;
const db = require('./db');

app.get('/', (req, res) => {
  res.send('🎯 Welcome to the Links AI Backend!');
});
app.use(express.json());
const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT,
    logging: false,
  }
);

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();


// Define the User model
const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, // Ensure the username is unique
    },
    password: { // Will store the hashed password
        type: DataTypes.STRING,
        allowNull: false,
    },
    fname: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    lname: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    job: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true,
    }
}, {
    tableName: 'Users', // Optional: specify table name (default is pluralized model name)
    timestamps: true, // Automatically adds createdAt and updatedAt fields
});

// Test database connection and sync models (create tables if not exist)
(async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection to the database has been established successfully.');

        // Sync models with the database
        // { force: true } will drop and recreate the table (DANGEROUS: it deletes data)
        // { alter: true } adjusts table to match the model (recommended for development)
        await sequelize.sync({ alter: true });
        console.log('Database synced: Users table is ready.');
    } catch (error) {
        console.error('Unable to connect to the database or sync:', error);
        process.exit(1); // Exit the app if DB connection fails
    }
})();


app.get('/GetUserByEmail', async (req, res) => {
  const { email } = req.query;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).send('User not found');
    }

    res.json(user);
  } catch (err) {
    console.error('Query error:', err);
    res.status(500).send('Server error');
  }
});

// app.post('/register', async (req, res) => {
//     const { userName, password, fname, lname, job } = req.body;

//     if (!userName || !password) {
//         return res.status(400).json({ message: 'Username and password are required.' });
//     }

//     try {
//         // אם תרצי להחזיר סיסמה רגילה (לא מומלץ), אפשר להשאיר כך
//         // אחרת מומלץ להשתמש ב-bcrypt בשביל להקשות את הסיסמא

//         // יצירת משתמש חדש
//         const newUser = await User.create({
//             userName,
//             password,
//             fname: fname || null,
//             lname: lname || null,
//             job: job || null,
//             lastconnection: new Date(),
//         });

//         // להחזיר אובייקט ללא סיסמה
//         const userResponse = newUser.toJSON();
//         delete userResponse.password;

//         res.status(201).json({
//             message: 'User registered successfully!',
//             user: userResponse,
//         });

//     } catch (error) {
//         if (error.name === 'SequelizeUniqueConstraintError') {
//             return res.status(409).json({ message: 'Username already taken. Please choose another one.' });
//         }
//         console.error('Error registering user:', error);
//         res.status(500).json({ message: 'Internal server error. Please try again later.' });
//     }
// });



app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
