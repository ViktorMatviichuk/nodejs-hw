import createHttpError from 'http-errors';
import { User } from '../models/user.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';

export const updateUserAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      throw createHttpError(400, 'No file');
    }

    const result = await saveFileToCloudinary(
      req.file.buffer,
      req.user._id.toString()
    );
    const avatarUrl = result.secure_url;

    await User.findByIdAndUpdate(req.user._id, { avatar: avatarUrl });

    res.status(200).json({ url: avatarUrl });
  } catch (error) {
    next(error);
  }
};
