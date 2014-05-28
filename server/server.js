Meteor.publish('Courses', function(){
	return courses.find({});
});