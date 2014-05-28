Template.updateDialog.events({
	'click #change': function(e,t){
		e.preventDefault();
		var term = t.find('.term').value;
		var year = t.find('.yearInput').value;

		//Remove the warning if we have any
		$(t.find('.warning')).text("");

		//Find the one that we need to change
		sem = semesters.findOne({Year:Session.get('Year'), Term:Session.get('Term')});

		//Test the validity of input
		if(term != "" && 
				parseInt(year) >= 1900 && parseInt(year) <= 9999) {
			//Test the uniqueness of input
			if (semesters.findOne({Year:year,Term:term}) == null) {
				var termValue = termVal(term);

				var semesterClass = semesterCss(year,term);

				//Update database
				semesters.update({_id:sem._id},
								{$set:{Term:term, 
									Year:year, 
									TermValue: termValue, 
									css: semesterClass}});
				
				Session.set('Year','');
				Session.set('Term','');

				//Turn off updateDialog
				$(t.find('#updateDialog')).modal('hide');
			}// end if to test uniqueness
			else {
				//Put an alert here
				$(t.find('.warning')).text("Entered semester already exists");
			}
		}// end if to test validity
		else {
			$(t.find('.warning')).text("Invalid Input");
		}
	},

	'click #delete':function(e,t){
		e.preventDefault();
		$('#deleteDialog').modal('show');
	},

	'keypress': function(e,t) {
		if (e.which == 13) {
			return false;
		}
	}

});