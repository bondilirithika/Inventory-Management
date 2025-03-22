const express = require('express');
const router = express.Router();

// Test route for reports
router.get('/', (req, res) => {
  res.send('Reports API is working!');
});

module.exports = router;
