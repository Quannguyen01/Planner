Template.saveDialog.events({
	'click #save': function(e,t){
		var blob = new Blob([$("#savedInfo").val() || ""],
							{type: "application/json;charset=utf-8"});
		saveAs(blob, "planner.plan");
	}
})