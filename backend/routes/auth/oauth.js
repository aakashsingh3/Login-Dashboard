import express from 'express';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { OAuth2Client } from 'google-auth-library';
import User from '../../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Configure Google OAuth Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/api/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const user = await User.findOrCreateGoogleUser(profile);
    return done(null, user);
  } catch (error) {
    return done(error, null);
  }
}));

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user._id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// @desc    Google OAuth login
// @route   GET /api/auth/google
// @access  Public
router.get('/', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

// @desc    Google OAuth callback
// @route   GET /api/auth/google/callback
// @access  Public
router.get('/callback', 
  passport.authenticate('google', { session: false }),
  async (req, res) => {
    try {
      const user = req.user;
      
      // Generate JWT tokens
      const { accessToken, refreshToken } = user.generateTokens();
      
      // Save refresh token
      user.refreshToken = refreshToken;
      await user.save({ validateBeforeSave: false });
      
      // Set HTTP-only cookie for refresh token
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });
      
      // Redirect to frontend with token
      const redirectUrl = `${process.env.CLIENT_URL}/auth/success?token=${accessToken}`;
      res.redirect(redirectUrl);
    } catch (error) {
      console.error('Google OAuth callback error:', error);
      res.redirect(`${process.env.CLIENT_URL}/login?error=oauth_failed`);
    }
  }
);

// @desc    Handle Google OAuth token from frontend
// @route   POST /api/auth/google/token
// @access  Public
router.post('/token', async (req, res) => {
  try {
    const { credential } = req.body;
    
    // Verify Google token
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    
    const payload = ticket.getPayload();
    
    // Create user profile object
    const profile = {
      id: payload.sub,
      emails: [{ value: payload.email }],
      name: {
        givenName: payload.given_name,
        familyName: payload.family_name
      },
      photos: [{ value: payload.picture }]
    };
    
    // Find or create user
    const user = await User.findOrCreateGoogleUser(profile);
    
    user.lastLogin = new Date();

    // Generate JWT tokens
    const { accessToken, refreshToken } = user.generateTokens();
    
    // Save refresh token
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    
    // Set HTTP-only cookie for refresh token
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
    
    res.json({
      success: true,
      message: 'Google login successful',
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        provider: user.provider,
        profilePicture: user.profilePicture,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin
      },
      accessToken
    });
  } catch (error) {
    console.error('Google token verification error:', error);
    res.status(401).json({
      success: false,
      message: 'Invalid Google token'
    });
  }
});


export default router;

