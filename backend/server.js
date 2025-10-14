require('dotenv').config();
const fs = require('fs');
const path = require('path');

const appPath = fs.existsSync(path.join(__dirname, 'src', 'app.js'))
  ? './src/app'
  : './app';

const app = require(appPath);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
