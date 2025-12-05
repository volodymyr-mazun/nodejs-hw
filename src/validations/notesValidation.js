import { Joi, Segments } from 'celebrate';
import { isValidObjectId } from 'mongoose';

export const createNoteSchema = {
  [Segments.BODY]: Joi.object({
    title: Joi.string().min(3).max(20).required().messages({
      'string.base': 'Title must be a string',
      'string.min': 'Title should have at least {#limit} characters',
      'string.max': 'Title should have at most {#limit} characters',
      'any.required': 'Title is required',
    }),
    content: Joi.string().min(10).max(50).required().messages({
      'string.base': 'Content must be a string',
      'string.min': 'Content should have at least {#limit} characters',
      'string.max': 'Content should have at most {#limit} characters',
      'any.required': 'Content is required',
    }),
    tag: Joi.string()
      .valid(
        'Work',
        'Personal',
        'Meeting',
        'Shopping',
        'Ideas',
        'Travel',
        'Finance',
        'Health',
        'Important',
        'Todo',
      )
      .required()
      .messages({
        'any.only':
          'Tag must be one of: work, personal, meeting, shopping, ideas, travel, finance, health, important, todo',
        'any.required': 'Tag is required',
      }),
  }),
};

const objectIdValidator = (value, helpers) => {
  return !isValidObjectId(value) ? helpers.message('Invalid id format') : value;
};

export const noteIdSchema = {
  [Segments.PARAMS]: Joi.object({
    noteId: Joi.string().custom(objectIdValidator).required(),
  }),
};

export const updateNoteSchema = {
  [Segments.PARAMS]: Joi.object({
    noteId: Joi.string().custom(objectIdValidator).required(),
  }),
  [Segments.BODY]: Joi.object({
    title: Joi.string().min(3).max(20),
    content: Joi.string().min(10).max(50),
    tag: Joi.string().valid(
      'Work',
      'Personal',
      'Meeting',
      'Shopping',
      'Ideas',
      'Travel',
      'Finance',
      'Health',
      'Important',
      'Todo',
    ),
  }).min(1),
};

//ВАЛІДАЦІЯ ПАРАМЕТРІВ ПАГІНАЦІЯ ТА ФІЛЬТРУВАННЯ
export const getAllNotesSchema = {
  [Segments.QUERY]: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    perPage: Joi.number().integer().min(5).max(20).default(10),
    tag: Joi.string().valid(
      'Work',
      'Personal',
      'Meeting',
      'Shopping',
      'Ideas',
      'Travel',
      'Finance',
      'Health',
      'Important',
      'Todo',
    ),
    search: Joi.string().trim(),
    sortBy: Joi.string()
      .valid('_id', 'title', 'content', 'createdAt')
      .default('_id'),
    sortOrder: Joi.string().valid('asc', 'desc').default('asc'),
  }),
};
