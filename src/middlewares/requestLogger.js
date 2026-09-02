const requestLogger = (req, res, next) => {
    const start = Date.now();

    // 'finish' es un evento nativo del objeto 'res' de Node/Express:
    // se dispara cuando la respuesta ya se terminó de enviar al cliente.
    res.on("finish", () => {
        const duration = Date.now() - start;
        console.log(
            `${req.method} ${req.originalUrl} → ${res.statusCode} (${duration}ms)`,
        );
    });

    next();
};

module.exports = requestLogger;
