function getPicture(camera){
	
	var source = (camera) ? Camera.PictureSourceType.CAMERA : Camera.PictureSourceType.PHOTOLIBRARY;
	
    navigator.camera.getPicture(onSuccess, onFail, 
    	{
   			quality : 75,
        	destinationType: Camera.DestinationType.FILE_URI,
        	sourceType : source,
        	//allowEdit : true,
        	targetHeight : 1000,
    		targetWidth : 1000
        }
    );
}
function onSuccess(imageURI) {
	image_filter.init(imageURI);
}

function onFail(message) {
    alert('Failed because: ' + message);
}