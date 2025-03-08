// Required modules
import passport from "passport";
import { Strategy } from "passport-google-oauth20";
import dotenv from 'dotenv';

dotenv.config();

// Configure Passport with Google OAuth Strategy
passport.use(
    new Strategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    }, function (accessToken, refreshToken, profile, done) {
        return done(null, profile);
    }, function(error) {
      return done(error, null);
    })
);

// Serialize user into the session
passport.serializeUser((user, done) => {
  done(null, user);
});

// Deserialize user from the session
passport.deserializeUser((obj, done) => {
  done(null, obj);
});


// Export
export { passport as googleAuth};