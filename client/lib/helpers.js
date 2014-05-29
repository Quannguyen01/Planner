
//******************************************************************
//					HELPERS FUNCTION
//*****************************************************************
displayClassInfo = function(course) {

	var courseData = courses.findOne({CourseID:$(course).text()});
	
	var prerequisite = "none";
	if (courseData.Prerequisite)
		prerequisite = courseData.Prerequisite;

	var corequisite = "none";
	if (courseData.Corequisite)
		corequisite = courseData.Corequisite;

	var conflict = "";
	if ($(course).hasClass('season'))
		conflict += "Season - ";

	if ($(course).hasClass('prereq'))
		conflict += "Prerequisite - ";

	if ($(course).hasClass('coreq'))
		conflict += "Corequisite - ";

	if ($(course).hasClass('year'))
		conflict += "Year";

	var modal = 
		'<div class="modal fade"> \
			<div class="modal-dialog"> \
				<div class="modal-content"> \
					<div class="modal-header"> \
						<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button> \
						<h3 class="text-center">' + courseData.Name + '</h3> \
					</div> \
					<div class="modal-body"> \
						<p>Credit: ' + courseData.Credit + '</p>\
						<p>Season offer: ' + courseData.Season + '</p>\
						<p>This is where we put the class description</p> \
						<p>Prerequisite: ' + prerequisite + '</p> \
						<p>Corequisite: ' + corequisite + '</p> \
					</div> \
					<div class="modal-footer"> \
						<p class="pull-left">Conflict: ' + conflict + '</p>\
					</div> \
				</div> \
			</div> \
		</div>';

	$(modal).modal('show');
}


addToPlanner = function(semester, classAdded){

	var classNode = classAdded.item[0];

	if ($(semester).attr('id') != 'courses'){

		var classInfo = courses.findOne({CourseID:$(classNode).text()});

		var header = $(semester).parent();
		header = $($(header.children()[0]).children()[1]).text();
		var search = header.split(" ");

		var record = semesters.findOne({Term: search[0], Year: search[1]});

		if (record != null){
			var credit = record.Credit;
			credit += classInfo.Credit;
			
			semesters.update({_id: record._id},
								{$push:{Classes:$(classNode).text()},
								 $set:{Credit: credit}});

			$(classNode).remove();
		}

	} else {
		$(classNode).removeClass('prereq coreq season year');
	}
}

removeFromPlanner = function(semester, classRemoved){

	if ($(semester).attr('id') != 'courses'){

		var classNode = classRemoved.item[0];
		var classInfo = courses.findOne({CourseID: $(classNode).text()});

		var header = $(semester).parent();
		header = $($(header.children()[0]).children()[1]).text();
		var search = header.split(" ");

		var record = semesters.findOne({Term: search[0], Year: search[1]});

		var credit = record.Credit;
		credit -= classInfo.Credit;
			
		semesters.update({_id: record._id},
							{$pull:{Classes:$(classNode).text()},
							 $set:{Credit: credit}});
	}

}

/***************************************************************************
							CONFLICT FUNCTIONS
		These are functions to check the validity of a class in a semester
****************************************************************************/

getSemesterCompareValue = function(semester){
	var year = (semester.Year == "") ? 0 : parseInt(semester.Year);
	return semester.TermValue + year * 3;
}

addConflict = function(course, conflict){
	if (course['Conflict'] != null){
		course['Conflict'] += conflict + " "
	} else {
		course['Conflict'] = conflict + " "
	}
}

prereqConflict = function(course){
	prerequisites = course.Prerequisite;
	//console.log(prerequisites);

	//console.log(currentSemester);
	if (prerequisites) {
		currentSemester = semesters.findOne({Classes:course.CourseID});
		conflictAdd = false;
		var i = 0;
		//check prerequisite requirement
		while (!conflictAdd && i < prerequisites.length) {
			prereqSemester = semesters.findOne({Classes:prerequisites[i]})
			if (prereqSemester) {
				if (getSemesterCompareValue(currentSemester) <= getSemesterCompareValue(prereqSemester) &&
					getSemesterCompareValue(currentSemester) != 0 && 
					getSemesterCompareValue(prereqSemester) != 0) {
					
					addConflict(course,'prereq');
					conflictAdd = true;
				}	
			} else {
				addConflict(course, 'prereq');
				conflictAdd = true;
			}
			i++;
		}
	}
}

coreqConflict = function(course){
	corequisites = course.Corequisite;
	//console.log(corequisites);

	//console.log(currentSemester);
	if (corequisites) {
		currentSemester = semesters.findOne({Classes:course.CourseID});
		conflictAdd = false;
		//check corequisite requirement
		coreqSemester = semesters.findOne({Classes:corequisites})
		if (coreqSemester) {
			if (getSemesterCompareValue(currentSemester) < getSemesterCompareValue(coreqSemester)) {
				addConflict(course,'coreq');
				conflictAdd = true;
			}	
		} else {
			addConflict(course, 'coreq');
			conflictAdd = true;
		}
	}
}

seasonConflict = function(course,semester){
	
	if (semester != "Transfer") {
		var courseSeason = course.Season;

		var found = courseSeason.indexOf(semester);

		if (found == -1) {
			addConflict(course, 'season');
		}
	}
}

yearConflict = function(course, year){
	if (year != "") {
		var courseYear = course.Year;

		if ((courseYear == "Even") && (year % 2 == 1) ||
			(courseYear == "Odd") && (year % 2 == 0)) {
			addConflict(course, 'year');
		}
	}
}


//---------------------------------------------------------------------------
search = function(){
	var searchWord = new RegExp(escapeRegExp(Session.get("searchWord")),"i");
	var query = [];
	var fields = Session.get("Filter");

	if (fields.length != 0) {
		for (var i = 0; i < fields.length; i++){
			var obj= new Object();
			obj[fields[i]] = {$regex: searchWord};
			query.push(obj);
		}

		var results = courses.find({$or: query,
							$where: function(){
								return (semesters.findOne({Classes:this.CourseID}) == null);
							}}).fetch();

		//output
		var output = "";
		if (results.length == 0)
			output = "<strong>Search not found!</strong>"
		else {
			for (var i = 0; i < results.length; i++){
				output += '<a class="btn btn-default text-center course" title="'+ results[i].Name 
							+ '">' + results[i].CourseID + '</a>';
			}
		}

		$('#courses').html(output);
	} else {
		$('#courses').html("<span>We require at least one checked checkbox in order to search</span>")
	}

}

escapeRegExp = function(string){
  return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

//---------------------------------------------------------------------------
termVal = function(term){
	var termValue;
	switch(term){
		case 'Spring': termValue = 0;
						break;
		case 'Summer': termValue = 1;
						break;
		default: termValue = 2;
					break;
	}
	return termValue;
}

semesterCss = function(year, term){
	var d = new Date();
	var css = term;
	if (parseInt(year) < d.getFullYear()){
		css = "past";
	} 
	return css;
}