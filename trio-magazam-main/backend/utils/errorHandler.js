// OOP Inheritance miras alma
// Reactda class componentin arashdir
class ErrorHandler extends Error {
    constructor(message , statusCode) {
        super(message)
        this.statusCode = statusCode
        // captureStackTrace xetani yoluna qeder gosterir
        Error.captureStackTrace(this , this.constructor)
    }
}

export default ErrorHandler
