import createHttpError from 'http-errors';
import { Session } from '../models/session.js';
import { User } from '../models/user.js';

export const authenticate = async (req, res, next) => {
  try {
    const { sessionId, accessToken } = req.cookies;
    
    if (!sessionId || !accessToken) {
      throw createHttpError(401, 'Missing session ID or access token');
    }

    const session = await Session.findOne({ _id: sessionId, accessToken });
    if (!session) {
      throw createHttpError(401, 'Session not found');
    }

    if (new Date() > session.accessTokenValidUntil) {
      throw createHttpError(401, 'Access token expired');
    }

    const user = await User.findById(session.userId);
    if (!user) {
      throw createHttpError(401);
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
