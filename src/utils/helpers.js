//helper functions and utils
const error = (code, message) => {
    const error = new Error(message)
    error.statusCode = code
    throw error
}

module.exports = {
    error
}