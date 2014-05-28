Template.deleteDialog.events({
	'click #delete':function(e,t){
		e.preventDefault();
		var delSem = semesters.findOne({Year:Session.get('Year'),
									Term:Session.get('Term')});

		//DO SOME MIGRATE STUFF BACK TO THE COURSE SIDE PANEL
		//Using jquery 'contains' selector $(abc:contains(text))
		//to get the classes from a semester

		var classes = $('.panel:contains("'+ Session.get('Term') + ' '
							+ Session.get('Year') + '") .course');

		if (classes != null) {
			for (var i = 0; i < classes.length; i++) {
				$(classes[i]).prependTo('#courses');
			}

			updatePlanner($('#courses'));
		}

		//Remove semester from the semester local database
		semesters.remove({_id:delSem._id});

		Session.set('Year','');
		Session.set('Term','');
	}
});