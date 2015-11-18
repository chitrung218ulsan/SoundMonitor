/**
 * Created by Hieu on 11/8/2015.
 */
// The default page when visiting the application. No need to login to view.

ApplicationController = RouteController.extend({
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
	},
	waitOn: function(){
		return [
			SoundMonitor.Client.apartmentSubscription,
			SoundMonitor.Client.builingSubscription,
			SoundMonitor.Client.homeSubscription,
			SoundMonitor.Client.nodeSubscription
		];
	},
	loadingTemplate: 'loading'
});
Router.configure({
	controller: 'ApplicationController'
});

var _generateZeroLevelRoute = function(path, name, template, staticTitle){
	Router.route(path, {
		name: name,
		template: template,
		title: staticTitle
	});
};
var _capitalizeFirstLetter = function(word) {
	return word.charAt(0).toUpperCase() + word.slice(1);
};
var _generateFirstLevelRoute = function(entityType){
	Router.route('/' + entityType + 's', {
		name: entityType,
		template: entityType + 'List',
		title : _capitalizeFirstLetter(entityType) + ' List',
		parent : 'setup',
		data: function(){
			var col = this.route.options.collectionObj;
			return col.find();
		},
		pageActionLinks: function(){
			return [
				SoundMonitor.Functions.createLinkObject(entityType + '.create', {}, {}, 'Add')
			];
		},
		entityType: entityType,
		collectionObj: SoundMonitor.Functions.getCollection(entityType)
	});
};
var _generateSecondLevelRoute = function(entityType){
	Router.route('/' + entityType + 's/create', {
		name: entityType + '.create',
		template: entityType + "Create",
		title: 'Add ' + entityType,
		parent : entityType,
		data: function(){
			return this.route.options.collectionObj._name;
		},
		entityType: entityType,
		collectionObj: SoundMonitor.Functions.getCollection(entityType)
	});
};
var _generateThirdLevelRoute = function(entityType){
	var pathView = '/' + entityType + 's/:_id/view';
	var pathModify = '/' + entityType + 's/:_id/edit';
	var pathDelete = '/' + entityType + 's/:_id/delete';
	var routeNameView = entityType + '.view';
	var routeNameModify = entityType + '.edit';
	var routeNameDelete = entityType + '.delete';
	var templateNameView = entityType + 'View';
	var templateNameModify = entityType + 'Edit';
	var templateNameDelete = entityType + 'Delete';
	Router.route(pathView,{
		name : routeNameView,
		template: templateNameView,
		title: function(){
			if(!this)
				return 'View';
			var doc = this.data();
			if (!doc)
				return 'View';
			return 'View ' + this.route.options.entityType + ' ' + doc.name;
		},
		parent : entityType,
		data: function(){
			var id = this.params._id;
			return this.route.options.collectionObj.findOne({_id: id});
		},
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
		entityType: entityType,
		collectionObj: SoundMonitor.Functions.getCollection(entityType)
	});
	Router.route(pathModify,{
		name : routeNameModify,
		template: templateNameModify,
		title: function(){
			var cuR = Router.current();
			if (!cuR)
				return 'Edit ' + entityType;
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
			if (!cuR)
				return 'Delete ' + entityType;
			var id = cuR.params._id;
			var col = SoundMonitor.Functions.getCollection(cuR.route.getName());
			var ent = col.findOne({_id: id});
			return 'Delete ' + cuR.route.options.entityType + ' ' + ent.name;
		},
		parent: routeNameView,
		entityType: entityType
	});
};

// Zero level of urls
_generateZeroLevelRoute('/', 'welcome', 'welcome', 'Welcome');
_generateZeroLevelRoute('/dashboard', 'dashboard', 'dashboard', 'Dashboard');
_generateZeroLevelRoute('/setup', 'setup', 'setup', 'Setup');
_generateZeroLevelRoute('/configuration', 'configuration', 'configuration', 'Configuration');
_generateZeroLevelRoute('/data_analysis', 'dataAnalysis', 'dataAnalysis', 'Data Analysis');
_generateZeroLevelRoute('/report', 'report', 'report', 'Report');

// First level of urls
_.each(['apartment', 'building', 'home', 'node'], function(ent){
	_generateFirstLevelRoute(ent);
	_generateSecondLevelRoute(ent);
	_generateThirdLevelRoute(ent);
});