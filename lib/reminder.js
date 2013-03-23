/*global module*/

function Reminder(due, action, message) {
	this.due = due;
	this.action = action;
	this.message = message;
}

module.exports = Reminder;

Reminder.prototype.dueDate = function dueDate() {
	var due = new Date(this.due);
	return due.toLocaleString();
};
