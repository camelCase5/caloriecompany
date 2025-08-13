// very tiny error handler for express so i always send a response
export function errorHandler(err, req, res, next) {
    console.error(err.stack);
    res.status(500).send("Something broke!");
}
