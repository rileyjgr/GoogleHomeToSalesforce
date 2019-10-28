({
	doInit : function(component, event, helper) {
        var mapMarkers = [];
        helper.onInit(component, event);
        component.set('v.mapMarkers', mapMarkers);
        component.set('v.zoomLevel', 3);
    }
})