// Create a standardized error response
exports.createError = (message, details = null) => {
  return {
    success: false,
    message,
    ...(details && { details })
  };
};

// Create a standardized validation error response
exports.createValidationError = (errors) => {
  return {
    success: false,
    message: 'Validation error',
    errors
  };
};

// Create a standardized not found error response
exports.createNotFoundError = (resource) => {
  return {
    success: false,
    message: `${resource} not found`
  };
};

// Create a standardized unauthorized error response
exports.createUnauthorizedError = () => {
  return {
    success: false,
    message: 'Unauthorized access'
  };
};

// Create a standardized forbidden error response
exports.createForbiddenError = () => {
  return {
    success: false,
    message: 'Access forbidden'
  };
}; 