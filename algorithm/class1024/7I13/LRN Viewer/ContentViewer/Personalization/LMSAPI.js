///////////////////////////////////////////////////////////////////////////////////////////////////
//
//	Copyright ?2000, Microsoft Corp.  All rights reserved.
//
//	@doc INTERNAL
//
//  @module LMSAPI.js |
//		Contains AICC LMS API Implementation.
//		This module contains the client side implementation of LMS API.
//	
//	@end
//	Creator:		a-mbatem		
//	Created:		11/29/99
//	Current Owner:	ymwong
//
///////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////
//
//	Global Variables
//
///////////////////////////////////////////////////////////////////////////////////////////////////
var b_LMSInitialized			= "false";
var gc_strLMSDataModelPath		= "LRN Viewer/contentviewer/personalization/LMSDataModel.xml";
var gc_strLMSErrorsPath			= "LRN Viewer/contentviewer/personalization/LMS_Errors.xml";

// Used for userData
var gc_strPersXMLAttribute		= "persXML";
var gc_strUserDataPrefix		= "lrnpers&";
var gc_strNeedSaveAttribute		= "NeedSave";

// Base Pers XML
var g_oBasePersXML				= LoadXML("<ROOT></ROOT>");

// LMS Errors XML
var g_oLMSErrorsXML				= LoadXMLFile(gc_strLMSErrorsPath);

// Error details types: these strings are used to construct LRNError objects
var gc_strParseError			= "XML_Parse_Error";
var gc_strJScriptError			= "JScript_Error";
var gc_strMultiStatusError		= "Multi-Status_Error";
var gc_strString				= "String";
var gc_strNoDetails				= "Null";

// For working with Pers XML
var gc_strPersElementName		= "lrnpers";
var gc_strPropertyPropName		= "Property";
var gc_strValuePropName			= "Value";
var gc_strOldValuePropName		= "Old_Value";
var gc_strScopePropName			= "Scope";
var gc_strTimePropName			= "Time";
var gc_strLRNStartLocation		= "lrn.startlocation";
var gc_strLRNPrefix				= "lrn.";

// Special case properties
var gc_strCMIStudentName		= "cmi.core.student_name";
var gc_strCMIStudentID			= "cmi.core.student_id";
var gc_strCMILessonStatus		= "cmi.core.lesson_status";
var gc_strCMIExitStatus			= "cmi.core.exit";

// Used for CVEO events
var gc_LMSAPI_LESSONSTATUS		= 200;
var gc_LMSAPI_EXITSTATUS		= 300;
var gc_CPO_SELECT				= 2;

///////////////////////////////////////////////////////////////////////////////////////////////////
//
//	Utility Functions
//
///////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////
//
//	@doc INTERNAL
//
//	@jsfunc LRNError | Constructor function for LRN error objects.
//						This object has 4 properties:
//						number: see description about nNumber parameter
//						strDetailsType: see description about strDetailsType parameter
//						oErrorDetails: see description about oErrorDetails parameter
//						description: String describing this error associated with the numeric
//										identifier
//
//	@parm  Integer	| nNumber			| The numeric identifier of this error.  The description
//											string will be loaded from the XML.
//	@parm  String	| strDetailsType	| A string description of the type of information in
//											oErrorDetails.  Several constants have been recorded
//											above as types LRN understands.  This parameter is
//											required if oErrorDetails is not null, but is ignored
//											if oErrorDetails is null.
//	@parm  Object	| oErrorDetails		| This parameter is optional.  Additional information 
//											about the error that occurred.  The type of this 
//											object is indicated by the strDetailsType parameter.
//
//	@rdesc  Javascript LRN error object or null if arguments are invalid
//	@comm 
//			This function cannot throw.
//	@end
//
////////////////////////////////////////////////////////////////////////////////////////////////////
function LRNError (nNumber,strDetailsType,oErrorDetails)
{
	// Checking parameter //////////////////////////////////////////////////////////////////////////
	if("number" != typeof(nNumber))
	{
		return null;
	}

	if("string" != typeof(strDetailsType))
	{
		strDetailsType = gc_strNoDetails;
	}

	if("undefined" != typeof(oErrorDetails))
	{
		oErrorDetails	= null;
	}
		
	// Object Initialization ///////////////////////////////////////////////////////////////////////
	// conformance to jscript error
	this.number			= nNumber;		
	this.strDetailsType	= strDetailsType;
	this.oErrorDetails	= oErrorDetails;
	this.description	= ErrorStringFromID(nNumber);

	return this;
}

////////////////////////////////////////////////////////////////////////////////////////////////////
//
//	@doc INTERNAL
//
//	@jsfunc ErrorStringFromID	| Searches error XML for the description of an error.
//
//	@parm	Integer	| nNumber	| The numeric identifier of the error for which to search.
//
//	@rdesc  If the ID cannot be found in the errors XML, an empty string is returned.  If the ID 
//			is found, the error description is returned.
//	@comm 
//			This function cannot throw.
//	@end
//
////////////////////////////////////////////////////////////////////////////////////////////////////
function ErrorStringFromID(nNumber)
{
	try
	{
		// Search for the string corresponding to the current number ///////////////////////////////////
		var oError = g_oLMSErrorsXML.selectSingleNode("/ROOT/LRNError[@ID=" + nNumber + "]");

		// Return Value Check //////////////////////////////////////////////////////////////////////////
		if(oError)
		{
			return oError.text;
		}
	}
	catch(e)
	{
	}
	return "";
}

////////////////////////////////////////////////////////////////////////////////////////////////////
//
//	@doc INTERNAL
//
//	@jsfunc LoadFromUserData | 
//
//	@parm	Object	| oUserData			|	UserData object
//	@parm	String	| strStoreName		|	String that specifies the arbitrary name assigned to 
//											a persistent object within a UserData store. 
//  @parm   String	| strAttributeName	|	String that specifies the name of the persistent 
//											attribute
//
//	@rdesc  Variant. Returns a string, number, or Boolean, defined by strAttributeName. 
//			If an explicit attribute doesn't exist, an empty string is returned. 
//			If a custom attribute doesn't exist, null is returned.	See Docs on userData behavior.
//			On error, this function returns null
//			
//	@comm 
//			This function cannot throw.
//	@end
//
////////////////////////////////////////////////////////////////////////////////////////////////////
function LoadFromUserData(oUserData,strStoreName,strAttributeName)
{
	try
	{
		// load userdata ///////////////////////////////////////////////////////////////////////////
		oUserData.load(strStoreName);
		return oUserData.getAttribute(strAttributeName);
	}
	catch(e)
	{
		return null;
	}
}

////////////////////////////////////////////////////////////////////////////////////////////////////
//
//	@doc INTERNAL
//
//	@jsfunc SaveToUserData | 
//
//	@parm	Object	| oUserData			|	UserData object
//	@parm	String	| strStoreName		|	String that specifies the arbitrary name assigned to 
//											a persistent object within a UserData store. 
//  @parm   String	| strAttributeName	|	String that specifies the name of the persistent 
//											attribute
//  @parm	String	| strValue			|	String to save to userData
//
//	@rdesc  None
//			
//			
//	@comm 
//			This function cannot throw.
//	@end
//
////////////////////////////////////////////////////////////////////////////////////////////////////
function SaveToUserData(oUserData,strStoreName,strAttributeName,strValue)
{
	try
	{
		// save userdata ///////////////////////////////////////////////////////////////////////////
		oUserData.setAttribute(strAttributeName, strValue);				
		oUserData.save(strStoreName);
	}
	catch(e)
	{
	}
	return;
}

////////////////////////////////////////////////////////////////////////////////////////////////////
//
//	@doc Internal
//
//	@jsfunc LoadXML	
//					| Loads the xml string and checks for parse error. 
//
//  @parm String	| strXML	| xml string
//
//	@rdesc  Returns on xmldom object on success.  Otherwise returns null.
//		
//	@comm 
//			This function cannot throw.
//	@end
//
////////////////////////////////////////////////////////////////////////////////////////////////////
function LoadXML(strXML)
{
	try
	{
		if(("string" != typeof(strXML)) || ("" == strXML))
		{
			return null;
		}

		var oXML = new ActiveXObject("Msxml2.DOMDocument.3.0");
		oXML.async = false;
		oXML.loadXML(strXML);
		if(0 != oXML.parseError.errorCode)
		{
			return null;
		}

		return oXML;
	}
	catch(e)
	{
		return null;
	}
}

////////////////////////////////////////////////////////////////////////////////////////////////////
//
//	@doc Internal
//
//	@jsfunc LoadXMLFile
//					| Loads the xml file and checks for parse error. 
//
//  @parm String	| strFile	| filename
//
//	@rdesc  Returns on xmldom object on success.  Otherwise returns null.
//		
//	@comm 
//			This function cannot throw.
//	@end
//
////////////////////////////////////////////////////////////////////////////////////////////////////
function LoadXMLFile(strFile)
{
	try
	{
		if(("string" != typeof(strFile)) || ("" == strFile))
		{
			return null;
		}

		var oXML = new ActiveXObject("Msxml2.DOMDocument.3.0");
		oXML.async = false;
		oXML.load(strFile);
		if(0 != oXML.parseError.errorCode)
		{
			return null;
		}

		return oXML;
	}
	catch(e)
	{
		return null;
	}
}

///////////////////////////////////////////////////////////////////////////////////////////////////
//
//	Implementation of the LMSAPI object
//
///////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////
//
//	Constructor of the LMSAPI object
//
///////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////
//
//  @doc Internal
//
//	@jsfunc		LMSAPI				| Constructor for an LMSAPI object.  One LMSAPI object should 
//										be created for each personalization context (e.g. LRN 
//										installation, or the current course
//
//  @parm String	| strIdentifier | A string that uniquely identifies what the user data will
//										be saved under.  If this is not a string, the empty string 
//										is used.
//  @parm Boolean   | bPreview		| A boolean indicating if this object is in preview mode or not
//										If true, this object will not read/write to userData
//
//	@rdesc	Returns a newly created LMSAPI object on success.  On failure, returns null.
//
//	@comm 
//			If you pass in the 3 optional parameters, you must include cvobjs.js
//			This function cannot throw.
//	@end
//
///////////////////////////////////////////////////////////////////////////////////////////////////
function LMSAPI (strIdentifier,bPreview)
{
	try
	{
		// Checking parameter //////////////////////////////////////////////////////////////////////
		// Make nominal checks of the validity of the inputs
		if("string" != typeof(strIdentifier))
		{
			strIdentifier = "";
		}
		
		if("boolean" != typeof(bPreview))
		{
			return null;
		}

		// Object Initialization ///////////////////////////////////////////////////////////////////
		// Add member variables
		this.m_bInitialized			= false;
		this.m_bNeedSave			= false;
		this.m_bPreview				= bPreview;
		this.m_strIdentifier		= strIdentifier;
		this.m_oLastError			= null;
		this.m_oPersXML				= g_oBasePersXML.cloneNode(true);
		this.m_oLMSDataModel		= new LMSDataModel();
		this.m_oUserData			= g_oDefaultUserData;
		try
		{
			this.m_oContentViewerEvts	= new ContentViewerEvtsObj();
			this.m_oContentViewer		= new CViewerObj();
		}
		catch(e)
		{
			this.m_oContentViewerEvts	= null;
			this.m_oContentViewer		= null;
		}		
		return this;
	}
	catch(e)
	{
		return null;
	}
}

///////////////////////////////////////////////////////////////////////////////////////////////////
//
//	Public Methods of LMSAPI object
//
///////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////
//
//	See the CVO for documentation of the following
//
///////////////////////////////////////////////////////////////////////////////////////////////////
function LMSAPI.prototype.LRNDoNext()
{
	return this.m_oContentViewer.DoNext();
}
		
function LMSAPI.prototype.LRNDoPrevious()
{
	return this.m_oContentViewer.DoPrevious();
}
		
function LMSAPI.prototype.LRNDoSelect(id)
{
	return this.m_oContentViewer.DoSelect(id);
}
		
function LMSAPI.prototype.LRNDoSelectFirst()
{
	return this.m_oContentViewer.DoSelectFirst();
}

function LMSAPI.prototype.LRNGetCurrent()
{
	return this.m_oContentViewer.GetCurrent();
}

function LMSAPI.prototype.LRNGetNext(id)
{
	return this.m_oContentViewer.GetNext(id);
}

function LMSAPI.prototype.LRNGetPrevious(id)
{
	return this.m_oContentViewer.GetPrevious(id);
}

function LMSAPI.prototype.LRNGetParent(id)
{
	return this.m_oContentViewer.GetParent(id);
}

function LMSAPI.prototype.LRNSetCurrentTOC(strCurrentTOCID)
{
	return this.m_oContentViewer.SetCurrentTOC(strCurrentTOCID);
}
		
function LMSAPI.prototype.LRNGetCurrentTOC()
{
	return this.m_oContentViewer.GetCurrentTOC();
}

function LMSAPI.prototype.LRNGetTOCS()
{
	return this.m_oContentViewer.GetTOCS();
}
						
function LMSAPI.prototype.LRNGetChildren(id)
{
	return this.m_oContentViewer.GetChildren(id);
}
		
function LMSAPI.prototype.LRNGetItem(id)
{
	return this.m_oContentViewer.GetItem(id);
}
		
function LMSAPI.prototype.LRNGetCustomView()
{
	return this.m_oContentViewer.GetCustomView();
}

function LMSAPI.prototype.LRNIsReady()
{
	return this.m_oContentViewer.IsReady();
}

///////////////////////////////////////////////////////////////////////////////////////////////////
//
//	See the CVEO for documentation of the following
//
///////////////////////////////////////////////////////////////////////////////////////////////////
function LMSAPI.prototype.LRNListenForEvents(fnHandler)
{
	return this.m_oContentViewerEvts.ListenForEvents(fnHandler);
}

function LMSAPI.prototype.LRNUnListenForEvents(fnHandler)
{
	return this.m_oContentViewerEvts.UnListenForEvents(fnHandler);
}
  
function LMSAPI.prototype.LRNRaiseEvent(arg)
{
	return this.m_oContentViewerEvts.RaiseEvent(arg);
}	

///////////////////////////////////////////////////////////////////////////////////////////////////
//
//  @doc External
//
//	@jsfunc		LMSInitialize | LRN implementation of LMSInitialize, which initializes the LMS API
//								for use by the personalization client.  
//
//	@parm string	| strProperty	|	A string set to "" must be passed for conformance to the current LMS standard.  
//
//	@rdesc	Returns 1 to indicate that the initialization was successful or -1 to indicate
//			a failure.
//
//	@comm 
//			This function cannot throw.
//	@end
//
///////////////////////////////////////////////////////////////////////////////////////////////////
function LMSAPI.prototype.LMSInitialize(strProperty)
{
//	The real work of initializing the LMSAPI object is done in LRNInitialize, which is
//	a private method.  This function does little or no initialization.
var b_notfalse = "false";
try
{
	// Reset the API's last error so the current call starts clean.
	this.m_oLastError = null;

    // Check to see if LMSInitialize has already been called
	if (b_LMSInitialized == "true")
	{
		b_notfalse = "true";
		this.m_oLastError = new LRNError(101);
		throw this.m_oLastError;
		
	}	

	if (strProperty != "" && strProperty != null)
	{
		this.m_oLastError = new LRNError(201);
		throw this.m_oLastError;
	}

	// Checking object state 
	if(!this.m_bInitialized)
	{
		throw new LRNError(301);
	}
	else
		b_LMSInitialized = "true";
}
catch(e)
{
	if("undefined" == typeof(e.strDetailsType))
	{
		this.m_oLastError = new LRNError(101, gc_strJScriptError, e);
	}
	else
	{
		this.m_oLastError = e;
	}
	if (b_notfalse == "true")
		return "false";
	else
		b_LMSInitialized = "false";
}
return b_LMSInitialized;
}

////////////////////////////////////////////////////////////////////////////////////////////////////
//
//	@doc External
//
//	@jsfunc LMSGetValue | LRN implementation of LMSGetValue, which retrieves the value of the 
//							named personalization property. 
//
//	@parm String | strProperty	|	The name of the property to retrieve.
//
//	@rdesc  If the property exists, its value is returned as a string.  Otherwise, "" is returned.
//
//	@comm 
//			This function cannot throw.
//
//			Note:  The current LRN implementation of the LMS API does not support datamodels 
//					or the _children, _count, or _version keywords.
//	@end
//
////////////////////////////////////////////////////////////////////////////////////////////////////
function LMSAPI.prototype.LMSGetValue (strProperty)
{
	try
	{		
		// Reset the API's last error so the current call starts clean.
		this.m_oLastError = null;

		if (b_LMSInitialized == "false" && strProperty.substring(0, 3) != "lrn")
		{
			this.m_oLastError = new LRNError(301);
			throw new LRNError(301);
		}

		var strScope		= "";
		// Only attach scope if not lrn.startlocation
		if(strProperty != gc_strLRNStartLocation)
		{
			strScope = this.LMSGetValue(gc_strLRNStartLocation);	
		}

		return this.LRNGetScopedValue(strProperty, strScope);
	}
	catch(e)
	{
		if("undefined" == typeof(e.strDetailsType))
		{
			this.m_oLastError = new LRNError(101, gc_strJScriptError, e);
		}
		else
		{
			this.m_oLastError = e;
		}
		return "";
	}
}

////////////////////////////////////////////////////////////////////////////////////////////////////
//
//	@doc External
//
//	@jsfunc LRNGetScopedValue	| LRN implementation of LRNGetScopedValue, which retrieves the 
//									value of the named personalization property for the named scope
//
//	@parm String | strProperty		|	The name of the property to retrieve.
//	@parm String | strScope			|	The name of the scope of the property to retrieve.
//  @parm bool	 | bLMS				|	Only LMS is allowed to use this parameter
//
//	@rdesc  If the property exists, its value is returned as a string.  Otherwise, "" is returned.
//
//	@comm 
//			This function cannot throw.
//	@end
//
////////////////////////////////////////////////////////////////////////////////////////////////////
function LMSAPI.prototype.LRNGetScopedValue (strProperty,strScope,bLMS)
{
	try
	{
		// Reset the API's last error so the current call starts clean.
		this.m_oLastError = null;

		// Parameter and Object State Check ////////////////////////////////////////////////////////		
		// Make sure that we were passed a reasonable argument
		if("string" != typeof(strProperty) || "" == strProperty)
		{
			throw new LRNError(201);
		}
	
		if("string" != typeof(strScope))
		{
			throw new LRNError(201);
		}
				
		// Make sure we are initialized
		if(!this.m_bInitialized || null == this.m_oPersXML)
		{
			throw new LRNError(301);
		}
	
		// Reject any of the cmi.objectives.xxx, cmi.interactions.xxx, cmi.student_xxx
		if ("cmi.objectives" == strProperty.substring(0,14) ||
			"cmi.interactions" == strProperty.substring(0,16) ||
			"cmi.student" == strProperty.substring(0,11))
		{
			throw new LRNError(401);
		}

		var bInDataModel	= this.m_oLMSDataModel.IsInDataModel(strProperty);

		// Check if property is part of the Datamodel
		if(true == bInDataModel)
		{
			// If not implemented, throw an error
			if(false == this.m_oLMSDataModel.IsImplemented(strProperty))
			{
				throw new LRNError(401);
			}
			
			// The LMS is allowed to write to any datamodel properties
			if(true != bLMS)
			{
				// If not read access, throw an error
				if(false == this.m_oLMSDataModel.IsAllowRead(strProperty))
				{
					throw new LRNError(404);
				}
			}

			// If object is not item scope, set scope to ""
			if(false == this.m_oLMSDataModel.IsItemScoped(strProperty))
			{
				strScope = "";
			}
		//}

		var strRetVal = "";
		
		if(0 == strProperty.indexOf(gc_strLRNPrefix))
		{
			strRetVal = this.GetLRNProperty(strProperty, strScope);
			if(strRetVal != "")
			{
				return strRetVal;
			}
		}

		strRetVal = this.InternalGetValue(strProperty, strScope);

		if(strRetVal != "")
		{
			return strRetVal;
		}

		strRetVal = this.m_oLMSDataModel.GetDefaultValue(strProperty);
		
		return strRetVal;
	}
	else
	{
		throw new LRNError(201);
	}
	}
	catch(e)
	{
		if("undefined" == typeof(e.strDetailsType))
		{
			this.m_oLastError = new LRNError(101, gc_strJScriptError, e);
		}
		else
		{
			this.m_oLastError = e;
		}
		return "false";
	}
}

////////////////////////////////////////////////////////////////////////////////////////////////////
//
//	@doc External
//
//	@jsfunc LMSSetValue | LRN implementation of LMSSetValue, which sets the value of the named
//							personalization property.  The change is not commited to the store 
//							until LMSCommit or LMSFinish is called.
//
//	@parm String | strProperty	|	The name of the property to modify.
//	@parm String | strValue		|	The value to set.  This must be a number, a boolean, or a
//										string.  We will convert the value to a string before
//										setting it.
//
//	@rdesc  none
//
//	@comm 
//			This function cannot throw.
//
//			Note:  The current LRN implementation of the LMS API does not support datamodels 
//					or the _children, _count, or _version keywords.
//	@end
//
////////////////////////////////////////////////////////////////////////////////////////////////////
function LMSAPI.prototype.LMSSetValue(strProperty,strValue)
{
	var rc; 
	try
	{		
		// Reset the API's last error so the current call starts clean.
		this.m_oLastError = null;

		if (b_LMSInitialized == "false" && strProperty.substring(0, 3) != "lrn")
		{
			this.m_oLastError = new LRNError(301);
			throw new LRNError(301);
		}

		var strScope		= "";
		// Only attach scope if not lrn.startlocation
		if(strProperty != gc_strLRNStartLocation)
		{
			strScope = this.LMSGetValue(gc_strLRNStartLocation);
		}

		rc = this.LRNSetScopedValue(strProperty, strValue, strScope);	
		return rc;		
	}
	catch(e)
	{
		if("undefined" == typeof(e.strDetailsType))
		{
			// Return a general error, because we don't know exactly what happened.
			this.m_oLastError = new LRNError(101, gc_strJScriptError, e);
		}
		else
		{
			this.m_oLastError = e;
			
		}
		return "false";
	}
	//return "true";
}

////////////////////////////////////////////////////////////////////////////////////////////////////
//
//	@doc External
//
//	@jsfunc LRNSetScopedValue	| LRN implementation of LRNSetScopedValue, which sets the value 
//							of the named personalization property for the named scope.  The change 
//							is not commited to the store until LMSCommit or LMSFinish is called.
//
//	@parm String | strProperty	|	The name of the property to modify.
//	@parm String | strValue		|	The value to set.  This must be a number, a boolean, or a
//										string.  We will convert the value to a string before
//										setting it.
//	@parm String | strScope		|	The name of the scope for this property
//  @parm bool	 | bLMS			| Only LMS is allowed to use this parameter
//
//	@rdesc  none
//
//	@comm 
//			This function cannot throw.
//	@end
//
////////////////////////////////////////////////////////////////////////////////////////////////////
function LMSAPI.prototype.LRNSetScopedValue(strProperty,strValue,strScope,bLMS)
{
	try
	{		
		// Reset the API's last error so the current call starts clean.
		this.m_oLastError = null;

		// Parameter and Object State Check ////////////////////////////////////////////////////////		
		// Make sure that we were passed a reasonable argument
		

		if("string" != typeof(strProperty) || "" == strProperty)
		{
			throw new LRNError(201);
		}
			
		if("string" != typeof(strValue))
		{
			if("number" == typeof(strValue) || "boolean" == typeof(strValue))
			{
				strValue = strValue.toString();
			}
			else if(null != strValue )
			{
				throw new LRNError(201);
			}
		}

		if("string" != typeof(strScope))
		{
			throw new LRNError(201);
		}

		// Make sure we are initialized
		if(!this.m_bInitialized || null == this.m_oPersXML)
		{
			throw new LRNError(301);
		}

        // Reject any of the cmi.objectives.xxx, cmi.interactions.xxx, cmi.student_xxx
		if ("cmi.objectives" == strProperty.substring(0,14) ||
			"cmi.interactions" == strProperty.substring(0,16) ||
			"cmi.student" == strProperty.substring(0,11))
		{
			throw new LRNError(401);
		}

		var bInDataModel	= this.m_oLMSDataModel.IsInDataModel(strProperty);

		// Check if property is part of the Datamodel
		if(true == bInDataModel)
		{
			// If not implemented, throw an error
			if(false == this.m_oLMSDataModel.IsImplemented(strProperty))
			{
				throw new LRNError(401);
			}

			if(true == this.m_oLMSDataModel.IsKeyword(strProperty))
			{
				throw new LRNError(402);
			}

			// Cannot set data model keyword 
			
			// The LMS is allowed to write to any datamodel properties
			if(true != bLMS)
			{
				// If not write access, throw an error

				if(false == this.m_oLMSDataModel.IsAllowWrite(strProperty))
				{
					throw new LRNError(403);
				}
				
			}

			// Verify that value is a valid vocabulary item
			if(false == this.m_oLMSDataModel.IsValidVocabulary(strProperty, strValue))
			{
				throw new LRNError(201);
			}

			// If object is not item scope, set scope to ""
			if(false == this.m_oLMSDataModel.IsItemScoped(strProperty))
			{
				strScope = "";
			}

		this.InternalSetValue(strProperty, strValue, strScope);

        if ("cmi.core.session_time" == strProperty)
		{
			var strSessionTime = strValue;
			var strTotalTime = this.LRNGetScopedValue("cmi.core.total_time", strScope, true);
			var strNewTime = AddTime(strTotalTime, strSessionTime);
			rc = this.LRNSetScopedValue("cmi.core.total_time", strNewTime, strScope, true);
		}

		if(	(gc_strCMILessonStatus == strProperty) && 
			(null != this.m_oContentViewerEvts))
		{
			switch(strValue)
			{

				case "completed":
				case "complete":
				case "incomplete":
				case "failed":
				case "browsed":
				case "not attempted":
				case "passed": 
					var oEvent = new Object();
					oEvent.type = gc_LMSAPI_LESSONSTATUS;
					oEvent.id = strScope;
					this.LRNRaiseEvent(oEvent);
					break;
			}
		}	
		
		else if(	(gc_strCMIExitStatus == strProperty) && 
			(null != this.m_oContentViewerEvts))
		{
			var oEvent = new Object();
			oEvent.type = gc_LMSAPI_EXITSTATUS;
			oEvent.id = strScope;
			this.LRNRaiseEvent(oEvent);
		}	
	}
	else
	{
		throw new LRNError(201);
	}			
	return "true";
	}
	catch(e)
	{
		if("undefined" == typeof(e.strDetailsType))
		{
			// Return a general error, because we don't know exactly what happened.
			this.m_oLastError = new LRNError(101, gc_strJScriptError, e);
		}
		else
		{
			this.m_oLastError = e;
		}
		return "false";
	}
	
}

////////////////////////////////////////////////////////////////////////////////////////////////////
//
//	@doc External
//
//	@jsfunc LMSCommit	| LRN implementation of LMSCommit, which saves the current set of
//							personalization data to the personalization store.
//
//	@rdesc  none
//
//	@comm 
//			This function cannot throw.
//	@end
//
////////////////////////////////////////////////////////////////////////////////////////////////////
function LMSAPI.prototype.LMSCommit(strProperty)
{
	try
	{
		// Reset the API's last error so the current call starts clean.
		this.m_oLastError = null;

		if (strProperty != "")
		{
			this.m_oLastError = new LRNError(201);
			throw this.m_oLastError;
		}
		
		if (b_LMSInitialized == "false" && strProperty.substring(0, 3) != "lrn")
		{
			this.m_oLastError = new LRNError(301);
			throw new LRNError(301);
		}

		if(false == this.m_bNeedSave)
		{
			return "true";
		}

		// Saving XML and state ////////////////////////////////////////////////////////////////////
		this.SavePersXML();
	}
	catch(e)
	{
		if("undefined" == typeof(e.strDetailsType))
		{
			// Return a general error, because we don't know exactly what happened.
			this.m_oLastError = new LRNError(101, gc_strJScriptError, e);
		}
		else
		{
			this.m_oLastError = e;
		}
		return "false";
	}
	return "true";
}

////////////////////////////////////////////////////////////////////////////////////////////////////
//
//	@doc External
//
//	@jsfunc LMSFinish	| LRN implementation of LMSFinish, which saves the current set of
//							personalization data to the personalization store and terminates the
//							connection to the personalization store.
//
//	@rdesc  none
//		
//	@comm 
//			This function cannot throw.
//	@end
//
////////////////////////////////////////////////////////////////////////////////////////////////////
function LMSAPI.prototype.LMSFinish(strProperty)
{
//	This function just resets the LastError object to null.  Data is not committed to the server 
//	until LRNTerminate is called
try
{
	if (!b_LMSInitialized)
	{
		this.m_oLastError = new LRNError(101);
		throw new LRNError(101);
	}
	else
		b_LMSInitialized = "false";

	if (strProperty != "")
	{
		this.m_oLastError = new LRNError(201);
		throw new LRNError(201);
	}

	// Reset the API's last error so the current call starts clean.
	this.m_oLastError = null;
	
	return "true";
}
catch(e)
{
	if("undefined" == typeof(e.strDetailsType))
	{
		// Return a general error, because we don't know exactly what happened.
		this.m_oLastError = new LRNError(101, gc_strJScriptError, e);
	}
	else
	{
		this.m_oLastError = e;
	}
	return "false";
}
}

////////////////////////////////////////////////////////////////////////////////////////////////////
//
//	@doc External
//
//	@jsfunc LMSGetLastError	| LRN implementation of LMSGetLastError, which returns the ID of the
//								last error to occur.  A return value of zero indicates that the
//								last operation was successful.  Multiple consecutive calls to this
//								method will return the same value.
//
//	@rdesc  error number
//		
//	@comm 
//			This function cannot throw.
//	@end
//
////////////////////////////////////////////////////////////////////////////////////////////////////
function LMSAPI.prototype.LMSGetLastError()
{
	if(null == this.m_oLastError)
	{
		return 0;
	}
	return this.m_oLastError.number;
}

////////////////////////////////////////////////////////////////////////////////////////////////////
//	@doc External
//
//	@jsfunc LMSGetErrorString	| LRN implementation of LMSGetErrorString, which returns the 
//									string associated with a specific error ID.
//
//	@parm	Integer	| nErrorNumber	| ID of the error for which to return a description.
//
//	@rdesc  none
//
//	@comm 
//			This function cannot throw.
//	@end
//
////////////////////////////////////////////////////////////////////////////////////////////////////
function LMSAPI.prototype.LMSGetErrorString(nErrorNumber)
{
	try
	{
		var strErrorString = ErrorStringFromID(nErrorNumber);
		return strErrorString;
	}
	catch(e)
	{
		return "";
	}
}

////////////////////////////////////////////////////////////////////////////////////////////////////
//
//	@doc External
//
//	@jsfunc LMSGetDiagnostic	| LRN implementation of LMSGetErrorString, which returns additional
//									information regarding a specific error.  The LRN implementation
//									will only return additional information about the last error to
//									occur.
//
//	@parm	Integer	| nErrorNumber	| ID of the error for which to return a description.  
//										Must be null
//
//	@rdesc  none
//		
//	@comm 
//			This function cannot throw.
//	@end
//
////////////////////////////////////////////////////////////////////////////////////////////////////
function LMSAPI.prototype.LMSGetDiagnostic(nErrorNumber)
{
	try
	{
		if(null != nErrorNumber)
		{
			return "";
		}

		if(null == this.m_oLastError || 0 == this.m_oLastError.number)
		{
			return "";
		}
		
		switch(this.m_oLastError.strDetailsType)
		{
		case gc_strParseError:
			return this.m_oLastError.oErrorDetails.reason;
		case gc_strJScriptError:
			return this.m_oLastError.oErrorDetails.description;
		case gc_strMultiStatusError:
			return this.m_oLastError.oErrorDetails.xml;
		case gc_strString:
			return this.m_oLastError.oErrorDetails;
		default:
			return "";
		}
	}
	catch(e)
	{
	}
	return "";
}

///////////////////////////////////////////////////////////////////////////////////////////////////
//
//	Private Methods of LMSAPI object
//
///////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////
//	@doc Internal
//
//	@jsfunc LoadPersXML		| Attempts to retrieve the set of personalization data 
//								from the client side personalization store.  
//
//	@rdesc	None
//			An exception is thrown for all other errors
//		
//	@comm 
//			This function can throw.
//	@end
//
////////////////////////////////////////////////////////////////////////////////////////////////////
function LMSAPI.prototype.LoadPersXML()
{
	// If we are in Preview Mode, we do not need to R/W userData
	if(true == this.m_bPreview)
	{
		return;
	}

	// Get the pers XML from user data
	var strPersXML = LoadFromUserData(	this.m_oUserData, 
										gc_strUserDataPrefix + this.m_strIdentifier,
										gc_strPersXMLAttribute	);
		
	var oXML = LoadXML(strPersXML);
	if(null != oXML)
	{
		this.m_oPersXML = oXML;
	}

	return;
}

////////////////////////////////////////////////////////////////////////////////////////////////////
//
//	@doc Internal
//
//	@jsfunc SavePersXML	| Saves the current set of personalization data to the client side 
//								personalization store.  
//
//	@rdesc	None
//			An exception is thrown for all other errors
//		
//	@comm 
//			This function can throw.
//	@end
//
////////////////////////////////////////////////////////////////////////////////////////////////////
function LMSAPI.prototype.SavePersXML()
{
	// If we are in Preview Mode, we do not need to R/W userData
	if(true == this.m_bPreview)
	{
		return;
	}

	// Save to user data
	SaveToUserData(	this.m_oUserData,
					gc_strUserDataPrefix + this.m_strIdentifier,		
					gc_strPersXMLAttribute,
					this.m_oPersXML.xml	);
	
	this.m_bNeedSave = false;
	return;
}

///////////////////////////////////////////////////////////////////////////////////////////////////
//
//	Private Methods of LMSAPI object (Exposed to LRN clients)
//
///////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////
//
//  @doc Internal
//
//	@jsfunc		LRNInitialize	| LRN initialization method for client LMSAPI object.  This 
//									function loads the personalization XML from userdata.
//									If this method returns false, only the LMS error methods may 
//									be called on the LMSAPI object.
//
//	@parm String	| strURLClass	| Optional parameter: this parameter is used to initialize the
//										CVO.  See CVO Init function documentation
//
//	@parm String	| strURLLRN		| Optional parameter: this parameter is used to initialize the
//										CVO.  See CVO Init function documentation
//
//	@parm String	| strXSLPath	| Optional parameter: this parameter is used to initialize the
//										CVO.  See CVO Init function documentation
//
//	@rdesc	Returns true to indicate that the initialization was successful or false to
//			indicate a failure.
//
//	@comm 
//			This function cannot throw.
//	@end
//
///////////////////////////////////////////////////////////////////////////////////////////////////
function LMSAPI.prototype.LRNInitialize(strURLClass,strURLLRN,strXSLPath)
{
    g_LMSInitialize = 0;
	try
	{
		// Reset the API's last error so the current call starts clean.
		this.m_oLastError = null;

		// Check object state //////////////////////////////////////////////////////////////////////
		if(this.m_bInitialized)
		{
			// We're already initialized.
			return true;
		}

		this.m_bInitialized	= true;

		// Initialization //////////////////////////////////////////////////////////////////////////
		var oError = null;
		
		try
		{
			// Initialize the CVO
			if(	("string" == typeof(strURLClass))	&&
				("string" == typeof(strURLLRN))		&&
				("string" == typeof(strXSLPath))	)
			{
				this.m_oContentViewerEvts.Init(this);
				this.m_oContentViewer.Init(strURLClass, strURLLRN, strXSLPath, this);
			}
		}
		catch(e)
		{
			oError = e;
		}

		// Get from userdata
		this.LoadPersXML();

		if(null != oError)
		{
			throw oError;
		}

		return true;
	}
	catch(e)
	{
		if("undefined" == typeof(e.strDetailsType))
		{
			// Return a general error, because we don't know exactly what happened.
			this.m_oLastError = new LRNError(101, gc_strJScriptError, e);
		}
		else
		{
			this.m_oLastError = e;
		}
		return false;
	}
}

////////////////////////////////////////////////////////////////////////////////////////////////////
//
//	@doc Internal
//
//	@jsfunc LRNTerminate	| Commits the changes made to personalization data since calling
//								LRNInitialize or LMSCommit.
//
//	@rdesc  none
//	@comm 
//			This function cannot throw.
//	@end
//
////////////////////////////////////////////////////////////////////////////////////////////////////
function LMSAPI.prototype.LRNTerminate()
{
	try
	{
		// Reset the API's last error so the current call starts clean.
		this.m_oLastError = null;

		this.LMSCommit();		

		this.m_bInitialized = false;
	}
	catch(e)
	{
		if("undefined" == typeof(e.strDetailsType))
		{
			// Return a general error, because we don't know exactly what happened.
			this.m_oLastError = new LRNError(101, gc_strJScriptError, e);
		}
		else
		{
			this.m_oLastError = e;
		}
	}
}

////////////////////////////////////////////////////////////////////////////////////////////////////
//
//	@doc Internal
//
//	@jsfunc LRNGetView	| Get a customized view of the Pers XML
//
//	@parm	Object	| oXSL	| An XMLDOM with XSL or null
//
//	@rdesc  String: the transformation result
//
//	@comm 
//			This function cannot throw.
//			If the oXSL parameter is null, a string copy of the Pers xml is returned
//	@end
//
////////////////////////////////////////////////////////////////////////////////////////////////////
function LMSAPI.prototype.LRNGetView(oXSL)
{
	try
	{
		// Reset the API's last error so the current call starts clean.
		this.m_oLastError = null;
		
		// Parameter and Object State Check ////////////////////////////////////////////////////////		
		// Make sure we are initialized
		if(!this.m_bInitialized || null == this.m_oPersXML)
		{
			throw new LRNError(301);
		}

		if(null == oXSL)
		{
			return new String(this.m_oPersXML.xml);
		}

		// Make sure that we were passed reasonable inputs
		if("object" != typeof(oXSL))
		{
			throw new LRNError(201);
		}

		// Run transformation //////////////////////////////////////////////////////////////////////
		return this.m_oPersXML.transformNode(oXSL);
	}
	catch(e)
	{
		if("undefined" == typeof(e.strDetailsType))
		{
			// Return a general error, because we don't know exactly what happened.
			this.m_oLastError = new LRNError(101, gc_strJScriptError, e);
		}
		else
		{
			this.m_oLastError = e;
		}
		return "";
	}
}

////////////////////////////////////////////////////////////////////////////////////////////////////
//
//	@doc Internal
//
//	@jsfunc InternalGetValue	| Used for getting a value from Pers XML or Admin Pers XML
//
//	@parm String | strProperty	|	property
//	@parm String | strScope		|	scope
//
//	@rdesc  If the property exists, its value is returned as a string.  Otherwise, "" is returned.
//
//	@comm 
//			This function can throw.
//	@end
//
////////////////////////////////////////////////////////////////////////////////////////////////////
function LMSAPI.prototype.InternalGetValue(strProperty,strScope)
{
	// Getting a property value from xml ///////////////////////////////////////////////////////
	// Example of pattern: /ROOT/LRNpers[@property='assessment1_score' && @scope='ITEM22']
	var strPattern =	"/ROOT/" + gc_strPersElementName + 
						"[@" + gc_strPropertyPropName + "=\'" + strProperty +
						"\' && @" + gc_strScopePropName + "=\'" + strScope;
	strPattern += "\']";

	var oProperty = this.m_oPersXML.selectSingleNode(strPattern);

	// Return Value Check //////////////////////////////////////////////////////////////////////
	if(null == oProperty)
	{
		// We don't consider this an error.
		return "";
	}

	return oProperty.attributes.getNamedItem(gc_strValuePropName).value;
}

////////////////////////////////////////////////////////////////////////////////////////////////////
//
//	@doc Internal
//
//	@jsfunc InternalSetValue	| Finds the specified row in the internal XML, sets the Value 
//									attribute to strValue.
//
//	@parm String | strProperty	|	Property
//	@parm String | strValue		|	New Value
//	@parm String | strScope		|	Scope
//
//	@rdesc  none
//		
//	@comm 
//			This function can throw.
//	@end
//
////////////////////////////////////////////////////////////////////////////////////////////////////
function LMSAPI.prototype.InternalSetValue(strProperty,strValue,strScope)
{
	// Setting a property value to xml /////////////////////////////////////////////////////////
	// Example of pattern: /ROOT/LRNpers[@property='assessment1_score' && @scope='ITEM22']
	var strPattern =	"/ROOT/" + gc_strPersElementName + 
						"[@" + gc_strPropertyPropName + "=\'" + strProperty +
						"\' && @" + gc_strScopePropName + "=\'" + strScope;
	strPattern += "\']";

	var oRow		= this.m_oPersXML.selectSingleNode(strPattern);

	// If a property is being added, add a row to the Pers XML
	// If a property is being deleted, remove it from the Pers XML
	// If a property is being updated, change the value in the Pers XML

	// Case 1 Adding a property
	if(	(null == oRow) && 
		(! ((null == strValue) || ("" == strValue)) ) )
	{
		var oNewRow				= this.m_oPersXML.createElement(gc_strPersElementName);


		var oProperty			= this.m_oPersXML.createAttribute(gc_strPropertyPropName);
		oProperty.value			= strProperty;
		oNewRow.attributes.setNamedItem(oProperty);

		var oPropertyValue		= this.m_oPersXML.createAttribute(gc_strValuePropName);
		oPropertyValue.value	= strValue;
		oNewRow.attributes.setNamedItem(oPropertyValue);

		var oScope				= this.m_oPersXML.createAttribute(gc_strScopePropName);
		oScope.value			= strScope;
		oNewRow.attributes.setNamedItem(oScope);

		var oTime				= this.m_oPersXML.createAttribute(gc_strTimePropName);
		oTime.value				= "";	// value assigned at the COM object						
		oNewRow.attributes.setNamedItem(oTime);
		
		// Add the new row to Pers XML 
		this.m_oPersXML.documentElement.appendChild(oNewRow);

		this.m_bNeedSave = true;
	}
		
	// case 2 Deleting a property
	if(	(null != oRow) && 
		((null == strValue) || ("" == strValue)) )
	{
		oRow.attributes.removeNamedItem(gc_strValuePropName);

		this.m_bNeedSave = true;
	}

	// case 3 Updating a property
	if(	(null != oRow) && 
		(! ((null == strValue) || ("" == strValue)) ) )
	{
		var oPropertyValue = oRow.attributes.getNamedItem(gc_strValuePropName);
		if(null == oPropertyValue)
		{
			// The property value must've been deleted in previous calls to this function
			// Create the new attribute
			oPropertyValue			= this.m_oPersXML.createAttribute(gc_strValuePropName);
			oPropertyValue.value	= strValue;
			oRow.attributes.setNamedItem(oPropertyValue);
			
			this.m_bNeedSave = true;
		}
		else
		{
			// The property value exists
			if(oPropertyValue.value != strValue)
			{
				// Just change the value
				oPropertyValue.value	= strValue;
				this.m_bNeedSave		= true;
			}
		}
	}

	// otherwise, the only case left is
	//	if(	(null == oRow) && 
	//		((null == strValue) || ("" == strValue)) )
	// this case is ignored since it means deleting a row that does not exist

	return;
}

////////////////////////////////////////////////////////////////////////////////////////////////////
//
//	@doc Internal
//
//	@jsfunc GetLRNProperty		| Finds the lrn property from the CVO
//
//	@parm String | strProperty	|	Property
//	@parm String | strScope		|	Scope
//
//	@rdesc  string
//		
//	@comm 
//			This function can throw.
//	@end
//
////////////////////////////////////////////////////////////////////////////////////////////////////
function LMSAPI.prototype.GetLRNProperty(strProperty,strScope)
{
	try
	{
		var oXML =	this.LRNGetItem(strScope);
		if("lrn.item.title" == strProperty)
		{
			return oXML.documentElement.childNodes(0).getAttribute("Name")
		}
		if("lrn.item.parentid" == strProperty)
		{
			return oXML.documentElement.childNodes(0).getAttribute("ParentID");
		}
		if("lrn.item.haschildren" == strProperty)
		{
			return oXML.documentElement.childNodes(0).getAttribute("HasChildren");
		}
		return "";
	}
	catch(e)
	{
		return "";
	}
}

///////////////////////////////////////////////////////////////////////////////////////////////////
//
//	Implementation of the LMSDataModel object
//
///////////////////////////////////////////////////////////////////////////////////////////////////
function LMSDataModel()
{
	try
	{
		this.m_oXMLInfo	= LoadXMLFile(gc_strLMSDataModelPath);
	
		if (this.m_oXMLInfo == null)
			return null;
		else
			return this;
	}
	catch(e)
	{
		return null;
	}	
}

function LMSDataModel.prototype.IsInDataModel(strProperty)
{
	try
	{
		var strPattern	=	"/ROOT/LMSDataModel[@Property='";
		strPattern		+=	strProperty;
		strPattern		+=	"']";

		var oNode		= this.m_oXMLInfo.selectSingleNode(strPattern);
		if(oNode)
		{
			return true;
		}
	}
	catch(e)
	{
	}
	return false;
}

function LMSDataModel.prototype.IsImplemented(strProperty)
{
	try
	{
		var strPattern	=	"/ROOT/LMSDataModel[@Property='";
		strPattern		+=	strProperty;
		strPattern		+=	"']";

		var oNode		= this.m_oXMLInfo.selectSingleNode(strPattern);
		if("true" == oNode.getAttribute("Implemented"))
		{
			return true;
		}
	}
	catch(e)
	{
	}
	return false;
}

function LMSDataModel.prototype.IsKeyword(strProperty)
{
	try
	{
		var strPattern	=	"/ROOT/LMSDataModel[@Property='";
		strPattern		+=	strProperty;
		strPattern		+=	"']";

		var oNode		= this.m_oXMLInfo.selectSingleNode(strPattern);
		if("true" == oNode.getAttribute("Keyword"))
		{
			return true;
		}
	}
	catch(e)
	{
	}
	return false;
}

function LMSDataModel.prototype.GetDefaultValue(strProperty)
{
	try
	{
		var strPattern	=	"/ROOT/LMSDataModel[@Property='";
		strPattern		+=	strProperty;
		strPattern		+=	"']";

		var oNode		= this.m_oXMLInfo.selectSingleNode(strPattern);
		if(null != oNode.getAttribute("DefaultValue"))
		{
			return oNode.getAttribute("DefaultValue");
		}
	}
	catch(e)
	{
	}
	return "";
}

function LMSDataModel.prototype.IsAllowRead(strProperty)
{
	try
	{
		var strPattern	=	"/ROOT/LMSDataModel[@Property='";
		strPattern		+=	strProperty;
		strPattern		+=	"']";

		var oNode		= this.m_oXMLInfo.selectSingleNode(strPattern);
		if("true" == oNode.getAttribute("Read"))
		{
			return true;
		}
	}
	catch(e)
	{
	}
	return false;
}

function LMSDataModel.prototype.IsAllowWrite(strProperty)
{
	try
	{
		var strPattern	=	"/ROOT/LMSDataModel[@Property='";
		strPattern		+=	strProperty;
		strPattern		+=	"']";

		var oNode		= this.m_oXMLInfo.selectSingleNode(strPattern);
		if("true" == oNode.getAttribute("Write"))
		{
			return true;
		}
	}
	catch(e)
	{
	}
	return false;
}

function LMSDataModel.prototype.IsValidVocabulary(strProperty, strValue)
{
	try
	{
		var strPattern	=	"/ROOT/LMSDataModel[@Property='";
		strPattern		+=	strProperty;
		strPattern		+=	"']";

		var oNode	= this.m_oXMLInfo.selectSingleNode(strPattern);
		if("true" == oNode.getAttribute("IsControlledVocabulary"))
		{
			strPattern += "/LMSVocabulary";
			var oVocabNode = this.m_oXMLInfo.selectNodes(strPattern);
			if (oVocabNode)
			{
				for (var i=0; i<oVocabNode.length; i++) 
				{
					if (strValue == oVocabNode(i).text)
						return true;
				}
			}
			return false;
		}
		else
			return true;

	}
	catch(e)
	{
	}
	return false;
}

function LMSDataModel.prototype.IsItemScoped(strProperty)
{
	try
	{
		var strPattern	=	"/ROOT/LMSDataModel[@Property='";
		strPattern		+=	strProperty;
		strPattern		+=	"']";

		var oNode		= this.m_oXMLInfo.selectSingleNode(strPattern);
		if("item" == oNode.getAttribute("Scope"))
		{
			return true;
		}
	}
	catch(e)
	{
	}
	return false;
}

// Return Value: time delta in seconds
function UnFormatTimeDelta (strTime)
{
	try
	{
		if("string" != typeof(strTime))
		{
			return 0;
		}
		
		var arrTime = strTime.split(":");
		if(3 != arrTime.length)
		{
			return 0;
		}

		var nHours = parseInt(arrTime[0]);
		var nMinutes = parseInt(arrTime[1]);
		var nSeconds = parseInt(arrTime[2]);
		if(	(true == isNaN(nHours))		||
			(true == isNaN(nMinutes))	||
			(true == isNaN(nSeconds))	)
		{
			return 0;
		}

		return (nHours * 60 * 60) + (nMinutes * 60) + nSeconds;
	}
	catch(e)
	{
		return 0;
	}
}

// Return Value: time delta as string
function FormatTimeDelta (nSeconds)
{
	try
	{
		if(("number" != typeof(nSeconds)) || (0 > nSeconds))
		{
			return "0:00:00";
		}

		// 1 hour = 60 minutes * 60 seconds 
		var nHours = Math.floor(nSeconds / (60 * 60));
		nSeconds = nSeconds - (nHours * 60 * 60);

		var nMinutes = Math.floor(nSeconds / 60);
		nSeconds = nSeconds - (nMinutes * 60);

		var strHours = nHours.toString();

		var strMinutes;
		if(10 > nMinutes)
		{
			// single digit
			strMinutes = "0" + nMinutes.toString();
		}
		else
		{
			strMinutes = nMinutes.toString();
		}

		var strSeconds;
		if(10 > nSeconds)
		{
			// single digit
			strSeconds = "0" + nSeconds.toString();
		}
		else
		{
			strSeconds = nSeconds.toString();
		}

		return strHours + ":" + strMinutes + ":" + strSeconds;
	}
	catch(e)
	{
	alert ("catch in time 2");
		return "0:00:00";
	}
}

// Return Value: new time delta as string
function AddTime(strTime1, strTime2)
{
	try
	{
		var nTime1 = UnFormatTimeDelta(strTime1);
		var nTime2 = UnFormatTimeDelta(strTime2);
		var nNewTime = nTime1 + nTime2;
		return this.FormatTimeDelta(nNewTime);
	}
	catch(e)
	{
	alert ("catch in time1");
		return strTime1;
	}
}
