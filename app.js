(function(){
	'use strict';
  	angular.module('NarrowItDownApp', [])
  	.controller('NarrowItDownController', NarrowItDownController)
  	.service('MenuSearchService', MenuSearchService)
		.constant('ApiBasePath', "https://davids-restaurant.herokuapp.com")
		.directive('foundItems', FoundItemsDirective);

		function FoundItemsDirective(){
			var ddo = {
    			template: '<div class="loader"></div><span class="error" ng-transclude></span><div class="list"><ol><li ng-repeat="cat in menu.categories"><span>{{cat.name}}</span><button class="butt" ng-click="menu.onRemove({index: $index});">Don&#39;t want this one!</button><br><div class="descr">({{cat.description}})</div></li></ol></div>',
    			scope: {
      				categories: '<',
					onRemove: '&'
    			},
    			controller: NarrowItDownDirectiveController,
    			controllerAs: 'menu',
    			bindToController: true,
    			transclude: true,
    			link: NarrowItDownDirectiveLink
  				};
  			return ddo;
		}

		function NarrowItDownDirectiveLink(scope, element, attrs, controller){
			scope.$watch('menu.emptyList()', function(newValue, oldValue){
				    							if (newValue === true) {
      												displayWarning();
    											}
    											else {
      												removeWarning();
    											}
											});
			function displayWarning() {
    			// Using Angular jqLite
     			//var warningElem = element.find("span");
     			//warningElem.css('display', 'block');
     			//warningElem.css('color', 'red');

    			// If jQuery included before Angular
    			var warningElem = element.find("span.error");
    			console.log(warningElem);
    			warningElem.slideDown(900);
  			}

  			function removeWarning() {
    			// Using Angular jqLite
     			//var warningElem = element.find('span');
    			//warningElem.css('display', 'none');


    			// If jQuery included before Angular
    			var warningElem = element.find('span.error');
    			console.log(warningElem);
    			warningElem.slideUp(900);
  			}
		}

  		

		function NarrowItDownDirectiveController(){
			var menu1=this;
			menu1.emptyList=function(){
				//console.log(menu1);
				if(menu1.categories.length<1){
							return true;
						}
						else{
							return false;
						}
			}
		}

  	NarrowItDownController.$inject = ['MenuSearchService'];
  	function NarrowItDownController(MenuSearchService){
			var menu=this;
			menu.search=true;

			menu.searchTerm="";
			menu.categories=[];
			menu.warning="";

			menu.narrow=function(){
				var match=[];
				var promise=MenuSearchService.getMatchedMenuItems();
				menu.search=true;
				menu.categories=[];

				promise.then(function(response){
					match=response.data;
					if(menu.searchTerm.length<1){
						menu.warning="Nothing found";
						menu.categories=[];
					}
					else{
						for(var i=0; i<match.menu_items.length; i++){
							if(match.menu_items[i].description.toLowerCase().indexOf(menu.searchTerm)>=0){
								menu.categories.push(match.menu_items[i]);
							};
						};
						if(menu.categories.length<1){
							menu.warning="Nothing found";
						}
						else{
							menu.warning="";
						}
					};
					//console.log(menu);
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
