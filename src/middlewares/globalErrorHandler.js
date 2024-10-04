const globalErrorHandler = (err, req, res, next) => {
  // If it's not a custom operational error, convert it to a generic 500 error
  let error = { ...err };
  error.message = err.message;

  // Set default error values
  error.statusCode = error.statusCode || 500;
  error.status = error.status || 'error';

  // Log the error (optional for debugging)
  console.error('ERROR 💥:', err);

  // Send response for operational errors
  if (error.isOperational) {
    return res.status(error.statusCode).json({
      success: false,
      status: error.status,
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined, // Show stack trace in development only
    });
  }

  // For programming or unknown errors, send a generic message
  res.status(500).json({
    success: false,
    status: 'error',
    message: err.message,
  });
};

module.exports = globalErrorHandler;
