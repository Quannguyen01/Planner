Template.Planner.rendered = function(){
	//initialize the transfer here
	$('#courses, .semester-course').sortable({
			connectWith: '.link',

			remove: function(e,ui){
				removeFromPlanner(this,ui);
			},

			receive: function(e,ui){
				addToPlanner(this,ui);
			}
	});
}

Template.Planner.semesters = function(){
	return semesters.find({},{sort:{Year:-1, TermValue:-1}});
}

Template.Planner.course = function(){
	// Render course display in the planner
	courseTemp = [];
	for (var i = 0; i < this.Classes.length; i++){
		var courseAdd = courses.findOne({CourseID:this.Classes[i]});

		// *******************************************************
		// 	UPDATE THE COURSE SEASON CONFLICT AND CLASS CONFLICT
		// *******************************************************
		prereqConflict(courseAdd);
		coreqConflict(courseAdd);
		seasonConflict(courseAdd,this.Term);
		yearConflict(courseAdd,this.Year);

		courseTemp.push(courseAdd);
	}
	return courseTemp;
}

Template.Planner.events({
	'click .edit': function(e,t){
		e.preventDefault();
		if (this.Term != "Transfer") {

			$('#updateDialog .warning').text("");
			$('#updateDialog').modal('show');

			//Cache to store temporary value for update semester.
			//The bad thing about Session is it is going to be a global variable
			Session.set('Term',this.Term);
			Session.set('Year',this.Year);

			$('#updateDialog .term').val(this.Term);
			$('#updateDialog .yearInput').val(this.Year);
		}
	},

	'dblclick .course': function(e,t){
		e.preventDefault();
		displayClassInfo(e.target);
	}
});