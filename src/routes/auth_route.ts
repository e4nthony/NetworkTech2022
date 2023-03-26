import express from 'express'
const router = express.Router()
import Auth from '../controllers/auth.js'


router.post(
    '/register',
    Auth.register
);

router.post(
    '/login',
    Auth.login
);

router.get(
    '/logout',
    Auth.logout
);

/**
 * refresh token route
 */
router.get(
    '/refresh_auth',
    Auth.refresh
);

export = router;