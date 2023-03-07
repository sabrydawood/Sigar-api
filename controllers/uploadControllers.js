
const User = require("../models/User");
const fs = require("fs");
const { promisify } = require("util");
const pipeline = promisify(require("stream").pipeline);
const { uploadErrors } = require("../util/errors");

//upload image avatar for user
const uploadProfil = async (req, res) => {
  try {
    //Verification de type de fichier et s'assure qu'il s'agit d"une image
    if (
      req.file.detectedMimeType != "image/jpg" &&
      req.file.detectedMimeType != "image/png" &&
      req.file.detectedMimeType != "image/jpeg"
    )
      throw Error("invalid file");

    if (req.file.size > 800000) throw Error("max size");
  } catch (err) {
    const errors = uploadErrors(err);
    return res.status(201).json({ errors });
  }
  const fileName = req.body.pseudo + ".jpg";
  //creer le fichier
  await pipeline(
    req.file.stream,
    fs.createWriteStream(`${__dirname}/../uploads/avatar/${fileName}`)
  );
  try {
    await User.findByIdAndUpdate(
      req.body.userId,
      { $set: { avatar: "/uploads/avatar/" + fileName } },
      { new: true, upsert: true, setDefaultsOnInsert: true },
      (err, docs) => {
        if (!err) return res.send(docs);
        else return res.status(500).send({ message: err });
      }
    );
  } catch (err) {
    return res.status(500).send({ message: err });
  }
};
module.exports =  {
	uploadProfil };