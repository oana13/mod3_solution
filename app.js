(function(){
	'use strict';
  	angular.module('NarrowItDownApp', [])
  	.controller('NarrowItDownController', NarrowItDownController)
  	.service('MenuSearchService', MenuSearchService)
		.constant('ApiBasePath', "https://davids-restaurant.herokuapp.com")
		.directive('foundItems', FoundItemsDirective);

		function FoundItemsDirective(){
			var ddo = {
    		template: '<div class="loader"></div><div class="list"> <ol> <li ng-repeat="cat in menu.categories"> <span>{{cat.name}}</span> <button class="butt" ng-click="menu.onRemove({index: $index});">Don&#39;t want this one!</button><br><div class="descr">({{cat.description}})</div></li></ol></div>',
    		scope: {
      	categories: '<',
				onRemove: '&'
    		},
    		controller: NarrowItDownDirectiveController,
    		controllerAs: 'menu',
    		bindToController: true
  		};
  		return ddo;
		}

		function NarrowItDownDirectiveController(){
		}


  	NarrowItDownController.$inject = ['MenuSearchService'];
  	function NarrowItDownController(MenuSearchService){
			var menu=this;
			menu.search=true;

			menu.searchTerm="";
			menu.categories=[];

			menu.narrow=function(){
				var match=[];
				var promise=MenuSearchService.getMatchedMenuItems();
				menu.search=true;

				promise.then(function(response){
					match=response.data;
					for(var i=0; i<match.menu_items.length; i++){
						if(match.menu_items[i].description.toLowerCase().indexOf(menu.searchTerm)>=0){
							menu.categories.push(match.menu_items[i]);
						};
					};
					console.log(menu);
					menu.search=false;
				})
				.catch(function(error){
					console.log("Something went terribly wrong.");
			});

			menu.remove=function(itemIndex){
				menu.categories.splice(itemIndex,1);
			};
			menu.searchF=function(){
				return menu.search
			};
		}
  	}

  	MenuSearchService.$inject=['$http','ApiBasePath'];
		function MenuSearchService($http, ApiBasePath){
			var service=this;

			service.getMatchedMenuItems=function(){
				var match=[];
				var response = $http({
					method: "GET",
					url: (ApiBasePath + "/menu_items.json")
				});
				return response;
			};
		}
})();
