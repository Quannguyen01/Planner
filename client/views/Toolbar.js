//Display total credit in the planner
Template.Toolbar.total = function(){
	var sem = semesters.find().fetch();
	var numSem = sem.length;
	var total = 0;

	for (var i = 0; i < numSem; i++)
		total += sem[i].Credit;

	return total;
};

Template.Toolbar.events({
	'click #add' : function(e,t){
		$('#addDialog .warning').text("");
		$('#addDialog').modal('show');
	},

	'click #save': function(e,t){
		state = semesters.find({},{fields: {_id: 0, css :0, TermValue: 0},
			 					   sort: {Year:1, TermValue:1}}).fetch();
		savedString = JSON.stringify(state);
		Session.set("savedState", savedString);

		//show the modal
		$('#saveDialog #savedInfo').val(savedString);
		$('#saveDialog').modal('show');
	}
})