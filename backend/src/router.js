const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {  // welcome api
  res.json({
    message: 'Welcome to the API!',
  });
});

/**
 * @route   GET /api/hello
 * @desc    Responds with a simple greeting
 * @access  Public
 */
router.get('/hello', (req, res) => { // example route
  res.json({
    greeting: 'Hello, world!',
    message: 'This response comes from the main router file.',
  });
});

/**
 * @route   GET /api/hello/person
 * @desc    Responds with a personalized greeting
 * @access  Public
 */
router.get('/hello/person', (req, res) => { // example with query parameter
  const name = req.query.name || 'Anonymous';
  res.json({
    greeting: `Hello, ${name}!`,
  });
});


// TODO: Aircraft API will be placed here later
/**
 * @route   GET /api/hello/person
 * @desc    Responds with a personalized greeting
 * @access  Public
 */

module.exports = router;
