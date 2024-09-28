const jwt = require('jsonwebtoken');

const generateToken = (user) => {
    const accessSecretKey = process.env.JWT_SECRET || 'fallbackSecretKey';
    const refreshSecretKey = process.env.JWT_REFRESH_SECRET || 'fallbackRefreshSecretKey';
    // Access Token (expires in 1 hour)
    const accessToken = jwt.sign(
        { id: user.id, email: user.email },
        accessSecretKey, { expiresIn: '1h' });


    // Refresh Token (expires in 7 days)
    const refreshToken = jwt.sign({
        id: user.id, email: user.email
    }, refreshSecretKey, { expiresIn: "7d" });

    return { accessToken, refreshToken };
};

module.exports = generateToken;