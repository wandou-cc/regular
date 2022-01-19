// @ts-nocheck
let command = require('./command')

function activate(context) {
	context.subscriptions.push(command.keyReg);
}

module.exports = {
	activate
}
