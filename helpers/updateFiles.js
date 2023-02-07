const fs = require('fs').promises;
const jimp = require('jimp');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const publicDir = path.join(__dirname, '../public');

const updateFile = async (fieldname, file) => {
  // change the path and rename to a unique name
  const { path: temporaryName, originalname } = file;
  const [, extension] = originalname.split('.');
  const uniqueFileName = `${uuidv4(10)}.${extension}`;
  try {
    const filePublicURL = path.join(publicDir, fieldname, uniqueFileName);
    // move the file
    await fs.rename(temporaryName, filePublicURL);
    const fileURL = path.join('public', fieldname, uniqueFileName);
    // resize the image and save
    resizeFile(fileURL);
    return fileURL;
  } catch (err) {
    // remove the file from tmp
    await fs.unlink(temporaryName);
    throw err;
  }
};

const resizeFile = async path => {
  await jimp.read(path, (err, image) => {
    if (err) throw err;
    image.resize(250, 250).writeAsync(path);
  });
};

module.exports = { updateFile };
