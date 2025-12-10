import { model, Schema } from 'mongoose';

const userSchema = new Schema(
  {
    username: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      unique: true, // Email унікальний ідентифікатор
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8, // Мінімум 8 символів
    },
  },
  { timestamps: true, versionKey: false },
);

//Хук присвоєння email як username
userSchema.pre('save', function (next) {
  if (!this.username) {
    this.username = this.email;
  }
  next();
});

//Видалення паролю з відповіді
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export const User = model('User', userSchema);
