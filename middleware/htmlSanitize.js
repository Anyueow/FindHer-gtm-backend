const express = require('express');
const app = express();


function containsHtmlTags(input) {
  // Regular expression to check for any opening or closing HTML tags
  const htmlRegex = /<[^>]*>|<\/[^>]*>/gi;
  return htmlRegex.test(input);
}

function containsDollarSign(input) {
  // Check for the presence of the $ symbol
  return input.includes('$');
}

function htmlSanitize (req, res, next) {
  console.log('htmlSanitize check');
  console.log(req.body)
  try {
    for (const key in req.body) {
      if (req.body.hasOwnProperty(key)) {
        const value = req.body[key];
        if (value && containsHtmlTags(value) || containsDollarSign(value)) {
          console.log("HTML error");
          console.log(value);
          return res.status(400).json({ message: "< , >, $ symbols not allowed." });
        }
      }
    }
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: "An error occurred." });
  }

  next();
}

module.exports = htmlSanitize;
