class HomeController {
	constructor($ngRedux, $scope) {
		$scope.$on('onBeforeUnload', function(e, confirmation) {
	        // confirmation.message = "Hello";
	        // e.preventDefault();
	        console.log('Before leaving page'); // Use 'Preserve Log' option in Console
	    });
	    $scope.$on('onUnload', function(e) {
	        console.log('leaving page'); // Use 'Preserve Log' option in Console
	    });
	}

	mapStateToThis(state) {
		return {
			cards: state.cards
		};
	}
}

HomeController.$inject = ["$ngRedux","$scope"];

export default HomeController;
