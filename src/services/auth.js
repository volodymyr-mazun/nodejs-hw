// src/services/auth.js

import crypto from 'crypto';
import { FIFTEEN_MINUTES, ONE_DAY } from '../constants/time.js';
import { Session } from '../models/session.js';

export const createSession = async (userId) => {
  //генерує криптографічно стійку випадкову послідовність, кодуємо в base64
  const accessToken = crypto.randomBytes(30).toString('base64');
  const refreshToken = crypto.randomBytes(30).toString('base64');

  return Session.create({
    userId,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + ONE_DAY),
  });
};

// httpOnly: true — браузер не дає доступу до куки з JS
// secure: true — браузер надсилає таку куку лише через HTTPS
// sameSite: 'none' — дозволяє надсилати куку у крос-доменних запитах
// maxAge — час життя у мілісекундах

export const setSessionCookies = (res, session) => {
  res.cookie('accessToken', session.accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: FIFTEEN_MINUTES,
  });

  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: ONE_DAY,
  });

  res.cookie('sessionId', session._id, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: ONE_DAY,
  });
};
