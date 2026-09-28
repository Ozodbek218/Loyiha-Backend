exports.uploadImage = (req, res) => {
  if (!req.file && (!req.files || req.files.length === 0)) {
    return res.status(400).json({ message: 'Please upload at least one image' });
  }

  const host = `${req.protocol}://${req.get('host')}`;

  if (req.files && req.files.length > 0) {
    const urls = req.files.map(file => `${host}/uploads/${file.filename}`);
    return res.status(200).json({
      success: true,
      message: 'Images uploaded successfully',
      urls
    });
  }

  const url = `${host}/uploads/${req.file.filename}`;
  res.status(200).json({
    success: true,
    message: 'Image uploaded successfully',
    url
  });
};
