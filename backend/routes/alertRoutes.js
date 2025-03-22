const express = require('express');
const router = express.Router();

// Test route for alerts
router.get('/', (req, res) => {
  res.send('Alerts API is working!');
});

module.exports = router;
