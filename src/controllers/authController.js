import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import { User } from '../models/user.js';
import { createSession, setSessionCookies } from '../services/auth.js';
import { Session } from '../models/session.js';

//===========РЕЄСТРАЦІЯ КОРИСТУВАЧА===========
export const registerUser = async (req, res, next) => {
  const { email, password } = req.body;

  //Пошук  користувача з таким email
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(createHttpError(400, 'Email in use'));
  }

  // Хешуємо пароль, 10 раундів генерації
  const hashedPassword = await bcrypt.hash(password, 10);

  // Створюємо користувача
  const newUser = await User.create({
    email,
    password: hashedPassword,
  });

  // Створюємо нову сесію
  const newSession = await createSession(newUser._id);
  // Викликаємо, передаємо об'єкт відповіді та сесію
  setSessionCookies(res, newSession);
  res.status(201).json(newUser);
};

//===========ЛОГІН КОРИСТУВАЧА===========
export const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  // Перевіряємо чи користувач з такою поштою існує
  const user = await User.findOne({ email });
  if (!user) {
    return next(createHttpError(401, 'Invalid credentials'));
  }

  // Порівнюємо хеші паролів, порівнює введений пароль із хешем у базі
  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    return next(createHttpError(401, 'Invalid credentials'));
  }

  // Видаляємо стару сесію користувача
  await Session.deleteOne({ userId: user._id });
  // Створюємо нову сесію
  const newSession = await createSession(user._id);
  // Викликаємо, передаємо об'єкт відповіді та сесію
  setSessionCookies(res, newSession);
  res.status(200).json(user);
};

//==========ЛОГАУТ==========
export const logoutUser = async (req, res) => {
  const { sessionId } = req.cookies;
  if (sessionId) {
    await Session.deleteOne({ _id: sessionId });
  }

  res.clearCookie('sessionId');
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');

  res.status(204).send();
};

//Використовуємо метод res.clearCookie для видалення всіх куків: sessionId, accessToken і refreshToken
