// Envuelve un controller async para capturar automáticamente cualquier error
// y pasarlo a next(), sin necesidad de un try/catch en cada controller.
const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

module.exports = asyncHandler;
