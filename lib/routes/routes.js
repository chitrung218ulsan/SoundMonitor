/**
 * Created by Hieu on 11/8/2015.
 */
// The default page when visiting the application. No need to login to view.
Router.configure({
	defaultBreadcrumbTitle: 'My Default Title',
	defaultBreadcrumbLastLink: true,
	layoutTemplate: 'layout',
	onBeforeAction : function(){
		if(this.route.getName() == 'welcome'){
			if(Meteor.userId())
				this.redirect(this.params.query.next || 'dashboard');
			else
				this.next();
		}else{
			if(Meteor.userId())
				this.next();
			else
				Router.go('welcome', {}, {query: 'next=' + this.route.getName()});
		}
	}
});
Router.route('/', {
	name: 'welcome',
	template: 'welcome'
	,title: 'Welcome'
});
// Only signed-in users are allowed to visit.
/*
 * First level of url
 */
Router.route('/dashboard',{
	name: 'dashboard',
	template: 'dashboard',
	title: 'Dashboard'
});

Router.route('/setup',{
	name: 'setup',
	template: 'setup',
	title: 'Setup'
});
Router.route('/configuration', {
	name: 'configuration',
	template: 'configuration',
	title: 'Configuration'
});
Router.route('/data_analysis',{
	name: 'dataAnalysis',
	template: 'dataAnalysis',
	title: 'Data Analysis'
});
Router.route('/report', {
	name: 'report',
	template: 'report',
	title: 'Report'
});


var _capitalizeFirstLetter = function(word) {
	return word.charAt(0).toUpperCase() + word.slice(1);
};
var _setupEntityRoute = function(entityType, level){
	var path = undefined;
	var routeName = undefined;
	var templateName = undefined;
	var title = undefined;
	var parent = undefined;
	if(level == 'first'){
		// for example: /apartments : to list all apartments
		path = '/' + entityType + 's';
		routeName = entityType;
		templateName = entityType + 'List';
		title = _capitalizeFirstLetter(entityType) + ' List';
		parent = 'setup';
		Router.route(path, {
			name: routeName,
			template: templateName,
			title : title,
			parent : parent,
			pageActionLinks: function(){
				return [
					SoundMonitor.Functions.createLinkObject(entityType + '.create', {}, {}, 'Add')
				];
			},
			entityType: entityType
		});
	} else if (level == 'second'){
		path = '/' + entityType + 's/create';
		routeName = entityType + '.create';
		templateName = entityType + "Create";
		title = 'Add ' + entityType;
		parent = entityType;
		Router.route(path, {
			name: routeName,
			template: templateName,
			title: title,
			parent : parent,
			entityType: entityType
		})
	} else if (level == 'third'){
		var pathView = '/' + entityType + 's/:_id/view';
		var pathModify = '/' + entityType + 's/:_id/edit';
		var pathDelete = '/' + entityType + 's/:_id/delete';
		var routeNameView = entityType + '.view';
		var routeNameModify = entityType + '.edit';
		var routeNameDelete = entityType + '.delete';
		var templateNameView = entityType + 'View';
		var templateNameModify = entityType + 'Edit';
		var templateNameDelete = entityType + 'Delete';
		var titleView = _capitalizeFirstLetter(entityType) + ' Details';
		var titleModify = _capitalizeFirstLetter(entityType) + ' Edit';
		var titleDelete = _capitalizeFirstLetter(entityType) + ' Deletion';
		parent = entityType;
		Router.route(pathView,{
			name : routeNameView,
			template: templateNameView,
			title: function(){
				var cuR = Router.current();
				var id = cuR.params._id;
				var col = SoundMonitor.Functions.getCollection(cuR.route.getName());
				var ent = col.findOne({_id: id});
				return 'View ' + cuR.route.options.entityType + ' ' + ent.name;
			},
			parent : parent,
			pageActionLinks: function(){
				return [
					SoundMonitor.Functions.createLinkObject(routeNameModify,
						function(){
							return {_id: Router.current().params._id}
						}, {}, 'Edit'
					),
					SoundMonitor.Functions.createLinkObject(routeNameDelete,
						function(){
							return {_id: Router.current().params._id}
						}, {}, 'Delete'
					)
				];
			},
			entityType: entityType
		});
		Router.route(pathModify,{
			name : routeNameModify,
			template: templateNameModify,
			title: function(){
				var cuR = Router.current();
				var id = cuR.params._id;
				var col = SoundMonitor.Functions.getCollection(cuR.route.getName());
				var ent = col.findOne({_id: id});
				return 'Edit ' + cuR.route.options.entityType + ' ' + ent.name;
			},
			parent : routeNameView,
			entityType: entityType
		});
		Router.route(pathDelete,{
			name : routeNameDelete,
			template : templateNameDelete,
			title: function(){
				var cuR = Router.current();
				var id = cuR.params._id;
				var col = SoundMonitor.Functions.getCollection(cuR.route.getName());
				var ent = col.findOne({_id: id});
				return 'Delete ' + cuR.route.options.entityType + ' ' + ent.name;
			},
			parent: routeNameView,
			entityType: entityType
		});
	}else{
		return false;
	}
	return true;
};

_.each(['first','second','third'], function(level){
	_.each(['apartment', 'building', 'home', 'node'], function(ent){
		var result = _setupEntityRoute(ent,level);
		console.log('Creation of routes: ' + result);
	});
});