Template.loadDialog.events({
	'change #browse': function(e,t) {
		e.preventDefault();
		var filePath = e.currentTarget.value;
		filePath = filePath.replace(/^.*\\/,"");
		$('#uploadFile').val(filePath);
	},

	'click #load': function(e,t) {
		e.preventDefault();
		$('#uploadFile').val("");

		var file = $('#browse')[0].files[0];

		var reader = new FileReader();

		reader.onload = function(e) {
			var planner = JSON.parse(reader.result);
			//validate JSON string
			var pattern = [{"Term":String,
							"Year":String,
							"Credit":Number,
							"Classes":[String]}];
			
			if (Match.test(planner,pattern) == true) {			
				//load the planner
				//insert semester to the planner
				for (var i = 0; i < planner.length; i++) {
					//if semester has already existed in the planner
					//update that semester with new course
					//else
					//go through the object and get the termValue and css value
					//add the new one to the current planner

					var existedSem = semesters.findOne({Year:planner[i].Year, Term: planner[i].Term});
					if (existedSem != null) {
						semesters.update({_id:existedSem._id},
									{$set:{Credit: planner[i].Credit, 
											Classes: planner[i].Classes}});
					} else {					
						planner[i].TermValue = termVal(planner[i].Term);
						planner[i].css = semesterCss(planner[i].Year,planner[i].Term);

						semesters.insert(planner[i]);
					}

					//load courses
					search();
				}

				$(t.find('#loadDialog')).modal('hide');
			} else {
				$(t.find('.warning')).html("Could not load the saved planner.<br/> Please try to upload again.");
			}
		}

		reader.readAsText(file, "UTF-8");
	}
})