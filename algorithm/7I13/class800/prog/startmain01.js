//=============================================================================
//=== Filename : startmain.js
//=== Function : for 1024x768 courses 
//=== Version  : 2004/01/05
//=============================================================================
//var pasfurl="mms://210.71.227.36/"; // Online
var pasfurl="";   // Offline
//測驗通過分數
var passRaw=75;

if(document.layers) 
   window.captureEvents(Event.MOUSEDOWN); 

function nomenu() {   //This function aplies only to IE4, ignored otherwise.
   event.cancelBubble=true;
   event.returnValue=false;
   return false;
}

function right(e) {   //This function applies to all browsers.
   if(navigator.appName=="Netscape"&&(e.which!=1)) {
     return false;
   }
   else if(navigator.appName=="Microsoft Internet Explorer"&&(event.button!= 1)) {
      event.cancelBubble=true;
      event.returnValue=false;
      return false;
   }
}

document.onmousedown=right; 	//for all browsers
document.oncontextmenu=nomenu; 	//for IE5+   
window.onmousedown=right;

function findObj(n, d) {
	var p,i,x;  
	if(typeof(n)=="undefined") return null; 
	if(!d) d=document; 
	if((p=n.indexOf("?"))>0&&parent.frames.length) {
  	d=parent.frames[n.substring(p+1)].document; n=n.substring(0,p);
  }
  if(!(x=d[n])&&d.all) x=d.all[n];
  for (i=0;!x&&i<d.forms.length;i++) x=d.forms[i][n];
  for(i=0;!x&&d.layers&&i<d.layers.length;i++) x=MM_findObj(n,d.layers[i].document);
  if(!x && d.getElementById) x=d.getElementById(n); 
  return x;
}