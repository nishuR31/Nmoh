let handler =
  (func) =>
  (...args) =>
    Promise.resolve(func(...args)).catch((err) => {
      console.error("Handler Error:", err);
      // Re-throw the error instead of returning it
      // This ensures errors are properly caught by asyncHandler middleware
      throw err;
    });

export default handler;
