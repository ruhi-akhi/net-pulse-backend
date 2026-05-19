const dotenv = require('dotenv');
const app = require('./app');
const connectDatabase = require('./config/db');

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
