const dotenv = require('dotenv');
const app = require('./app'); // app.js context is in the same folder, so this is correct
const connectDatabase = require('./api/config/db'); // Path corrected to 'api'

dotenv.config();

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