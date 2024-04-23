var ns=navigator.appName.charAt(0)=="N", menuObj;
var global=new Array();
global["menuStyle"]="menu01";
global["menuOverStyle"]="menu01_over";
global["menuFocusStyle"]="menu01_focus";
global["curMenuId"]=".";
global["defaultUrl"]="";
global["init"]=true;
var agg=new Aggregation();
if (document.implementation && document.implementation.createDocument) {
	agg.xmldoc=document.implementation.createDocument("", "", null);
	agg.xmldoc.onload=function() { 		
		var s1=agg.parseAgg(); 
		agg.printUnit(document.getElementById("baseDiv"));
		setTimeout("openFirstClass();", 500);
		//goClass(global["curMenuId"], global["defaultUrl"]);	
	}
} else if(window.ActiveXObject) {
	agg.xmldoc=new ActiveXObject("Microsoft.XMLDOM");
	agg.xmldoc.async=false;
	agg.xmldoc.onreadystatechange=function() {		
		if(agg.xmldoc.readyState==4) { 
			var s1=agg.parseAgg(); 
			agg.printUnit(document.getElementById("baseDiv"));		
			setTimeout("openFirstClass();", 500);
			//goClass(global["curMenuId"], global["defaultUrl"]);			
		}
	}
}
function openFirstClass() {
	if(global["defaultUrl"]!="") {
		goClass(global["curMenuId"], global["defaultUrl"]);	
	} else {
		setTimeout("openFirstClass();", 500);
	}
}
function goClass(_id, _href) {	
	var toc_obj;	
	if(_id!=global["curMenuId"]) {
		toc_obj=document.getElementById("TOC_"+global["curMenuId"]);
		if(toc_obj!=null) {			
			toc_obj.className=global["menuStyle"];
		}		
	}
	global["curMenuId"]=_id;
	toc_obj=document.getElementById("TOC_"+global["curMenuId"]);
	if(toc_obj!=null) {
		toc_obj.className=global["menuFocusStyle"];
	}
	toc_obj=document.getElementById(global["curMenuId"]+"_submenu");	
	if(toc_obj!=null) {
		if(toc_obj.style.display=="none" || global["init"]==true) {
			toc_obj.style.display="";
			global["init"]=false;
		} else {
			toc_obj.style.display="none"
		}
	} 	
	try{
		if(_href!="" && _href!=null && typeof(_href)!="undefined") {
			parent.mainFrame_Loader.location="../"+_href;
			window.focus();
		}
	} catch(e) {
		return;
	}
}
function init() {
	agg.loadXml("../imsmanifest.xml");	
}		