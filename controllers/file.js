const DownloadedFile = require('../models/downloadedFile');
const sequelize = require('../util/database');



exports.getDownloadableExpenseFiles = (async (req, res, next) => {
  //req.user.getDownloadedFiles() == DownloadedFile.findAll({where: {userId: req.user.id}})
  try {
    console.log('############$#$#$#$#$#$###############')
    const files = await req.user.getDownloadedFiles();
    console.log(files);
    return res.status(200).json({ files: files, success: true });
  }
  catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, err: err });
  }
})




exports.deleteExpenseFile = (async (req, res, next) => {
  const t = await sequelize.transaction();
  const fileId = req.params.fileID;
  console.log('file id to delete expense file is: ')
  console.log(fileId);
  try {
    let noOfFiles = await DownloadedFile.destroy({
      where: { id: fileId, userId: req.user.id },
      transaction: t
    })
    console.log(noOfFiles);

    if (noOfFiles !== 0) {
      await t.commit();
      return res.status(200).json({ message: 'File deleted successfully', success: true });
    }
    await t.rollback();
    return res.status(200).json({ message: 'This file doesn\'t belong to user', success: false });
  }
  catch (err) {
    await t.rollback();
    console.log(err);
    return res.status(500).json({ err: err, success: false });
  }
})

