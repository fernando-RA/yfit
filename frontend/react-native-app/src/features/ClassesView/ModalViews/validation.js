import isURL from 'validator/lib/isURL';

export const linkValidate = (values, callback) => {
  const errors = {};
  const isValidURL = isURL(values.link);
  if (!isValidURL) {
    errors.link = 'Incorrect link';
  }
  callback(values.link, errors.link);
  return errors;
};

export const priceValidation = (values, callback, isClassFree) => {
  const errors = {};
  if (!isClassFree && values.price.replace(/^\$/, '') < 5) {
    errors.price = 'Price per attendee must be more than $5';
  }
  if (Number.isInteger(values.price.replace(/^\$/, ''))) {
    errors.price = 'Price can only be whole number';
  }
  if (values.attend_limit_count <= 0) {
    errors.attend_limit_count = 'Number of attendee must be more than 0';
  }
  if (values.attend_limit_count > 250) {
    errors.attend_limit_count = 'Number of attendee must be less than 250';
  }

  callback(values, errors);
  return errors;
};
