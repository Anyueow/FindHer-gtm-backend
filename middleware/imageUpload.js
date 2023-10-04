
const uploadAndCheckFileType = (req, res, next) => {
  if (!req.body || !req.body.profilePic) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const base64Image = req.body.profilePic;

  if (!base64Image.startsWith('data:image/')) {
    return res.status(400).json({ message: 'Please upload an image.' });
  }

  const fileTypeMatch = base64Image.match(/^data:image\/([A-Za-z-+/]+);base64,/);
  if (!fileTypeMatch || fileTypeMatch.length < 2) {
    return res.status(400).json({ message: 'Please upload an image.' });
  }

  const imageFormat = fileTypeMatch[1];
  const allowedExtensions = ['jpeg', 'jpg', 'png'];

  if (!allowedExtensions.includes(imageFormat)) {
    return res.status(400).json({ message: 'Please upload an image.' });
  }

  next();
};

module.exports = {
  uploadAndCheckFileType,
};
