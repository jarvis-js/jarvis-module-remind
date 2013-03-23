/*global module*/

function ReminderManager(jarvis) {
	this.jarvis = jarvis;
	this.reminders = [];
	this.current_timeout = null;
	this.loadReminders();
}

module.exports = ReminderManager;

ReminderManager.prototype.loadReminders = function loadReminders() {
	var self = this;
	this.jarvis.recall('reminders', function(reminders) {
		if (reminders) {
			self.reminders = reminders;
			self.queueNearestReminder();
		}
	});
};

ReminderManager.prototype.saveReminders = function saveReminders() {
	this.jarvis.remember('reminders', this.reminders);
};

ReminderManager.prototype.addReminder = function addReminder(reminder) {
	this.reminders.push(reminder);
	this.reminders.sort(function(a, b) {
		return a.due - b.due;
	});
	this.saveReminders();
	this.queueNearestReminder();
};

ReminderManager.prototype.queueNearestReminder = function queueNearestReminder() {
	this.clearCurrentTimeout();
	var now = (new Date()).getTime();
	while (this.reminders.length > 0 && this.reminders[0].due < now) {
		this.removeFirstReminder();
	}
	if (this.reminders.length > 0) {
		var self = this;
		this.current_timeout = setTimeout(function(reminder) {
			self.jarvis.reply(reminder.message, 'You asked me to remind you to ' + reminder.action);
			self.removeFirstReminder();
			self.queueNearestReminder();
		}, this.reminders[0].due - now, this.reminders[0]);
	}
};

ReminderManager.prototype.removeFirstReminder = function removeFirstReminder() {
	if (this.reminders.length > 0) {
		this.reminders.shift();
		this.saveReminders();
	}
};

ReminderManager.prototype.clearCurrentTimeout = function clearCurrentTimeout() {
	if (this.current_timeout) {
		clearTimeout(this.current_timeout);
	}
};
