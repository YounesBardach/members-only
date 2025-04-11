import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcryptjs';
import { pool } from '../models/pool.mjs';
import { getUserByUsername } from '../models/userQueries.mjs';

// Configure the Local Strategy for Passport
// This strategy is used for username/password authentication
// usernameField and passwordField specify which fields in the login form to use
passport.use(new LocalStrategy(
  {
    usernameField: 'username',  // The field name in the login form for username
    passwordField: 'password'   // The field name in the login form for password
  },
  // This is the verify callback function that validates the credentials
  async (username, password, done) => {
    try {
      // Attempt to find the user in the database
      const user = await getUserByUsername(username);
      
      // If no user is found, return false with an error message
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      
      // Compare the provided password with the hashed password in the database
      const isMatch = await bcrypt.compare(password, user.password);
      
      // If passwords don't match, return false with an error message
      if (!isMatch) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      
      // If everything is valid, return the user object
      return done(null, user);
    } catch (error) {
      // If there's an error, pass it to done
      return done(error);
    }
  }
));

// Serialize user for the session
// This determines what data from the user object should be stored in the session
// We're storing just the user id
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from the session
// This retrieves the user object from the database using the id stored in the session
passport.deserializeUser(async (id, done) => {
  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    done(null, result.rows[0]);
  } catch (error) {
    done(error);
  }
});

export default passport; 