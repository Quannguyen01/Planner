Template.Sidebar.rendered = function(){
	Session.set("searchWord","");
	Session.set("Filter", ["CourseID","Name","Category","Subject"]);
}

Template.Sidebar.course = function(){
	return courses.find({});
}

Template.Sidebar.events({
	'dblclick .course': function(e,t){
		e.preventDefault();
		displayClassInfo(e.target);
	},

	'click input[name="filter"]': function(e,t){
		e.preventDefault();
		var filter = Session.get("Filter");
		if (filter.indexOf(e.target.value) == -1)
			filter.push(e.target.value);
		else
			filter.splice(filter.indexOf(e.target.value),1);
		Session.set("Filter",filter);
		search();
	},

	'click #filter': function(e,t){
		e.preventDefault();
		$('#filterSearch').toggle("fast", function(){
			if ($('#filterSearch').css('display') != 'none'){
				$('#courses').css('height','80%');
			} else {
				$('#courses').css('height','90%');
			}
		});
	},

	'keyup #searchBox': function(e,t){
		e.preventDefault();
		var searchWord = e.currentTarget.value;
		Session.set("searchWord",searchWord);

		search();
	},

	'keypress' : function(e,t){
		if(e.which == 13) {
			return false;
		}
	}
})