courses = new Meteor.Collection("Courses");
semesters = new Meteor.Collection(null);

//initialize Transfer
semesters.insert({Term:"Transfer", 
			 Year:"", Credit:0, 
			 TermValue : 0, 
			 css:"past", Classes:[]});