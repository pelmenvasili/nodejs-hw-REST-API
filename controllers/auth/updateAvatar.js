const path = require("path");
const fs = require("fs/promises");
const jimp = require("jimp");
const { User } = require("../../models/user");

const avatarsDir = path.join(__dirname, "../", "public", "avatars");

const updateAvatar = async (req, res) => {
  const { _id } = req.user;
  const { path: tempUpload, originalname } = req.file;
  const filename = `${_id}_${originalname}`;

  const resultUpload = path.join(avatarsDir, filename);

  await jimp
    .read(tempUpload)
    .then((avatar) => avatar.resize(250, 250).writeAsync(tempUpload))
    .catch((err) => console.log(err.message));

  await fs.rename(tempUpload, resultUpload);

  const avatarURL = path.join("avatars", filename);
  await User.findByIdAndUpdate(_id, { avatarURL });

  res.json({
    avatarURL,
  });
};

module.exports = updateAvatar;
