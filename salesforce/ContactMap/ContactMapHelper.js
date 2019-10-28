/* eslint-disable prefer-arrow-callback */
({
	onInit : function(component, event, helper) {
		var action = component.get('c.fetchContacts');
        action.setCallback(this, function(response){
            var state = response.getState();
            if(state === 'SUCCESS' || state==='DRAFT'){
                var resultData = response.getReturnValue();
                console.log(resultData);
                var mapMarkers = [];
                for(let i=0; i<resultData.length; i++){
                    mapMarkers.push(
                        {
                        location: {
                            City: resultData[i].MailingCity,
                            Street: resultData[i].MailingStreet,
                            PostalCode:resultData[i].MailingPostalCode,
                            State: resultData[i].MailingState
                        },
                        title:resultData[i].Name,
                        description: resultData[i].Description,
                        icon: 'standard:contact'
                    }
                  );
                }
                console.log(mapMarkers);
               	component.set('v.mapMarkers', mapMarkers);
        		component.set('v.zoomLevel', 4);
            } else {
                var errors = response.getError();
                console.log('errors: '+ errors);
            }
        });
        $A.enqueueAction(action);
	}
})