
const colors = require('colors')
colors.setTheme({
    silly: 'rainbow',
    input: 'grey',
    verbose: 'yellow',
    prompt: 'grey',
    info: 'cyan',
    data: 'grey',
    help: 'cyan',
    warn: 'yellow',
    debug: 'green',
    error: 'red',
});
colors.enable()
function Logger(...args) {
    this.args = args;
}

Logger.prototype.info = function (o, ...n) {
    if(typeof o === 'object') {
        let text = ""
        Object.keys(o).forEach(key => {
            text += ` ${key}: ${colors.info(o[key])} `
        })
        console.log(colors.info("INFO - "), text, ` MESSAGE: ${colors.info(n.toString())}`)
    }
    if(typeof o === 'string') {
        console.log(colors.info("INFO - "),` MESSAGE: ${colors.info(o)}`)
    }
};
Logger.prototype.error = function (o, ...n) { 
    console.log(colors.error.bold("ERROR - "), `TRACE: ${colors.error(o?.err)}`, ` MESSAGE: ${colors.error(n.toString())}`); 
};
Logger.prototype.debug = function (o, ...n) {
     console.log(colors.debug.bold("DEBUG - "), `DATA: ${colors.warn(o)}`, ` MESSAGE: ${colors.info(n)}`); 
};
Logger.prototype.fatal = function (o, ...n) {
    console.log(colors.error.bold("FATAL - "),`TRACE: ${colors.error(o?.err)}`, ` MESSAGE: ${colors.error(n)}`); 
};
Logger.prototype.warn = function (o, ...n) {
    console.log(colors.warn.bold("WARNING - "),`TRACE: ${colors.warn(o?.err)}`, ` MESSAGE: ${colors.warn(o)}`);
};
Logger.prototype.trace = function (o, ...n) {
    console.log(colors.verbose.bold("TRACE - "),`TRACE: ${colors.verbose(o?.err)}`,` MESSAGE: ${colors.verbose(n)}`);
};
Logger.prototype.child = function () { return new Logger() };

module.exports = Logger