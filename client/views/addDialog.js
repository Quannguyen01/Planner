Template.addDialog.events({
	'click #submit' : function(e,t) {
		e.preventDefault();

		var term = t.find('.term').value;
		var year = t.find('.yearInput').value;

		//Remove the warning if we have any
		$(t.find('.warning')).text("");

		//Test the validity of input
		if(term != "" && 
				parseInt(year) >= 1900 && parseInt(year) <= 9999) {
			//Test the uniqueness of input
			if (semesters.findOne({Year:year,Term:term}) == null) {
				var termValue = termVal(term);

				var semesterClass = semesterCss(year, term);

				semesters.insert({Term:term, 
									Year:year, Credit:0, 
									TermValue : termValue, 
									css:semesterClass, Classes:[]});
				
				
				//Turn off the dialog
				$(t.find('#addDialog')).modal('hide');
			} else { 
				//Put an alert here
				$(t.find('.warning')).text("Entered semester already exists");
			}
		} else {
			//Put an alert here
			$(t.find('.warning')).text("Invalid Input");
		}

		$('#courses, .semester-course').sortable({
			connectWith: '.link',

			remove: function(e,ui){
				removeFromPlanner(this,ui);
			},

			receive: function(e,ui){
				console.log("Receive");
				addToPlanner(this,ui);
			}
		});

		//Reset value in the input box
		t.find('.term').value = "";
		t.find('.yearInput').value = "";
	},

	'keypress' : function(e,t){
		if(e.which == 13) {
			return false;
		}
	}
});