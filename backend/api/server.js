const dotenv = require('dotenv');
const path = require('path');

// Strictly pointing dotenv to look for the .env file inside the current folder (backend/api/)
dotenv.config({ path: path.join(__dirname, '.env') });

const app = require('./app'); 
const connectDatabase = require('./config/db'); 

const PORT = process.env.PORT || 5000;

connectDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Net Pulse backend listening on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Database connection failed:', error);
    process.exit(1);
  });