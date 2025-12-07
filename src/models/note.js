import { Schema, model } from 'mongoose';
import { TAGS } from '../constants/tags.js';

const noteSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: false,
      trim: true,
      default: '',
    },
    tag: {
      type: String,
      required: false,
      enum: TAGS, //correct
      default: 'Todo',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

//Додаємо текстовий індекс
noteSchema.index(
  { title: 'text', content: 'text' },
  {
    name: 'NoteTextIndex',
    weights: { title: 10, content: 5 },
    default_language: 'english',
  },
);

export const Note = model('Note', noteSchema);
