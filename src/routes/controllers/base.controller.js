import AppError from './../../lib/error';

class BaseController {
  filterParams = (params, whitelist) => {
    const filtered = {};
    for (const key in params) {
      if (whitelist.hasOwnProperty(key)) {
        filtered[key] = params[key];
      }
    }
    return filtered;
  };

  requiredParams = (params, whitelist) => {
    return new Promise((resolve, reject) => {
      for (const [key, value] of Object.entries(whitelist)) {
        if (value && !params.hasOwnProperty(key)) {
          reject(new Error(`${key} param is required.`));
        }
      }
      resolve(params);
    });
  }

  formatApiError = (err) => {
    if (!err) {
      // eslint-disable-next-line no-console
      return console.error('Provide an error');
    }

    const formatted = {
      message: err.message,
    };

    if (err.errors) {
      formatted.errors = {};
      const errors = err.errors;
      for (const type in errors) {
        if (errors.hasOwnProperty(type)) {
          formatted.errors[type] = errors[type].message;
        }
      }
    }

    return formatted;
  }

  createError = (error, status) => {
    return new AppError(error.message, status);
  }
}

export default BaseController;
