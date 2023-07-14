
const errorHandlerMiddleware = (err, req, res, next) => {
    res.status(500).json({
      type: err.constructor.name,
      message: err.toString(),
    });
  };

//Every function from the controllers will pass through the errorChecked MW, who will try catch the request and will report the error if the request fails
  const errorChecked = (handler) => {
    return async (req, res, next) => {
      try {
        await handler(req, res, next);
      } catch (err) {
        next(err);
      }
    };
  };
  
  export { errorHandlerMiddleware, errorChecked };
  