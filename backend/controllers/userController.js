
const registerUser = (req, res) => {
    const { fullName, phone, email, password, passwordAgain } = req.body;

    // Add your registration logic here

    res.status(201).json({ message: 'User registered successfully!' });
};

module.exports = {
    registerUser
};