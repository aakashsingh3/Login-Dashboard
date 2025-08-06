import express from 'express';
import registerRoutes from './register.js';
import loginRoutes from './login.js';
import profileRoutes from './profile.js';
import passwordRoutes from './password.js';
import verificationRoutes from './verification.js';
import oauthRoutes from './oauth.js';
import tokenRoutes from './tokens.js';

const router = express.Router();

// Mount routes 
router.use('/register', registerRoutes);       
router.use('/user', loginRoutes);                    
router.use('/refresh', tokenRoutes);          
router.use('/profile', profileRoutes);        
router.use('/password', passwordRoutes);    
router.use('/verify-email', verificationRoutes);
router.use('/google', oauthRoutes);


export default router;
