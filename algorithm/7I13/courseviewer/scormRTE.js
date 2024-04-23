function LMSAPI() {
	this.version="scorm12";	
}
LMSAPI.prototype.LMSInitialize = function(strProperty) {
	return "true";
}
LMSAPI.prototype.LMSCommit = function(strProperty) {
	return "true";
}
LMSAPI.prototype.LMSFinish = function(strProperty) {
	return "true";
}
LMSAPI.prototype.LMSGetDiagnostic = function(nErrorNumber) {
	return "";
}
LMSAPI.prototype.LMSGetErrorString = function(nErrorNumber) {
	return "";
}
LMSAPI.prototype.LMSGetLastError = function() {
	return 0;
}
LMSAPI.prototype.LMSGetValue = function(strProperty) {
	var result="";
	switch(strProperty) {
		case "cmi.core.lesson_status":
			result="incomplete";
			break;
		case "cmi.core.student_id":
			result="001";
			break;
		case "cmi.core.student_name":
			result="pcschool";
			break;
	}
	return result;
}
LMSAPI.prototype.LMSSetValue = function(strProperty, strValue) {
	return "true";
}
