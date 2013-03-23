/*global module,require*/

var Manager  = require('./lib/manager.js');
var Reminder = require('./lib/reminder.js');

module.exports = function(jarvis, module) {

	var manager = new Manager(jarvis);

	module.unload = function() {
		manager.clearCurrentTimeout();
	};

	module.addAction(module.createCommand({
		name: 'remind',
		match: /^remind me in ((?:(?:\d+) (?:weeks?|days?|hours?|hrs?|minutes?|mins?|seconds?|secs?)[ ,]*(?:and)? +)+)to (.*)/i,
		func: function(message, time, action) {
			var periods = {
				weeks: {
					value: 0,
					regex: "weeks?"
				},
				days: {
					value: 0,
					regex: "days?"
				},
				hours: {
					value: 0,
					regex: "hours?|hrs?"
				},
				minutes: {
					value: 0,
					regex: "minutes?|mins?"
				},
				seconds: {
					value: 0,
					regex: "seconds?|secs?"
				}
			};
			for (var key in periods) {
				time = time.replace(/^\s+|\s+$/g, '');
				var pattern = new RegExp('^.*?([\\d\\.]+)\\s*(?:(?:' + periods[key].regex + ')).*$', 'i');
				var matches = pattern.exec(time);
				if (matches !== null) {
					periods[key].value = parseInt(matches[1], 10);
				}
			}
			var due = new Date().getTime();
			due += ((periods.weeks.value * 604800) + (periods.days.value * 86400) + (periods.hours.value * 3600) + (periods.minutes.value * 60) + periods.seconds.value) * 1000;

			var reminder = new Reminder(due, action, message);
			manager.addReminder(reminder);
			jarvis.reply(message, 'I\'ll remind you to ' + action + ' on ' + reminder.dueDate());
		}
	}));

};
