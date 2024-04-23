//=============================================================================
//=== Filename : startmain.js
//=== Function : for 800x600 courses 
//=== Version  :2004/01/05
//=============================================================================
//var pasfurl="mms://210.71.227.36/"; // Online
var pasfurl="";   // Offline

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