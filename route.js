Router.map(function(){
	this.route('home',{
		path: '/',
		template: 'Page',
		layoutTemplate: 'layout'
	});

	this.route('about',{
		path: '/about',
		layoutTemplate: 'layout'
	});

	this.route('notFound',{
		path: '*',
		template:'notFound'
	});

});