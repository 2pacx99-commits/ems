const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// مسار افتراضي
app.get('/api/status', (req, res) => {
    res.json({ status: 'Online', system: 'EMS High Command', province: 'Toronto' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
module.exports = app;