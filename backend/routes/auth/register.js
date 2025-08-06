import express from 'express';
import { body, validationResult } from 'express-validator';
import sendEmail from '../../utils/email.js';
import User from '../../models/User.js';

const router = express.Router();

// Register validation rules
const registerValidation = [
  body('firstName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
  body('lastName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please enter a valid email'),
  body('password')
    .isLength({ min: 8 })
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain at least 8 characters with uppercase, lowercase, number and special character')
];

// Register user
router.post('/', registerValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { firstName, lastName, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Create new user
    const user = new User({
      firstName,
      lastName,
      email,
      password
    });

    await user.save();

    // Generate tokens
    const { accessToken, refreshToken } = user.generateTokens();

    // Save refresh token to database
    user.refreshToken = refreshToken;
    await user.save();

    // Auto-send verification email
    try {
      const verificationToken = user.generateEmailVerificationToken();
      await user.save({ validateBeforeSave: false });

      const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;
      
      // Email HTML template
      const htmlMessage = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Welcome! Please verify your email</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
            .success { background: #d1edff; border: 1px solid #bee5eb; padding: 15px; border-radius: 5px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Welcome to Our Platform!</h1>
            </div>
            <div class="content">
              <h2>Hello ${user.firstName},</h2>
              <p>Thank you for registering! To complete your account setup and unlock all features, please verify your email address.</p>
              
              <center>
                <a href="${verificationUrl}" class="button">Verify Email Address</a>
              </center>
              
              <div class="success">
                <strong>✅ Why verify your email?</strong>
                <ul>
                  <li>Secure your account</li>
                  <li>Receive important notifications</li>
                  <li>Password recovery options</li>
                  <li>Full access to all features</li>
                </ul>
              </div>
              
              <p>If the button doesn't work, copy and paste this link into your browser:</p>
              <p style="word-break: break-all; background: #e9ecef; padding: 10px; border-radius: 5px;">
                ${verificationUrl}
              </p>
              
              <p><strong>This verification link will expire in 24 hours.</strong></p>
              
              <p>Best regards,<br>The Authentication Team</p>
            </div>
            <div class="footer">
              <p>If you didn't create an account, please ignore this email.</p>
            </div>
          </div>
        </body>
        </html>
      `;

      await sendEmail({
        email: user.email,
        subject: 'Welcome! Please verify your email address',
        html: htmlMessage,
      });

      console.log(`Verification email sent to ${user.email}`);
    } catch (emailError) {
      console.error('Verification email error:', emailError);
      // Don't fail registration if email fails - user can request verification later
    }

    // Set HTTP-only cookie for refresh token
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully. Please check your email to verify your account.',
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt
      },
      accessToken
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
});


export default router;