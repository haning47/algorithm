///////////////////////////////////////////////////////////////////////////////////////////////////
//
//	Copyright ?2000, Microsoft Corp.  All rights reserved.
//
//	@doc External
//
//  @module FindLMSAPI.js |
//		Contains the client-side Javascript that searches the window 
//		and framesets heirarchy to find an implementation of the AICC LMS API.
//	@end
//
//	Creator:		a-mbatem		
//	Created:		11/29/99
//	Current Owner:	ymwong
//
///////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////
//
//	@doc Internal
// 
//	@jsfunc FindLMSAPI | This function retrieves the JScript LMSAPI object.
//							Starting with the current window, it checks for the LMSAPI object.
//							It then trace back through the windows' parents.  If the LMSAPI object
//							is found, it is returned.  Once the trace back ends, the algorithm
//							checks the opener window and all its parents for the LMSAPI object. 
//
//	@rdesc  A valid LMSAPI object or null if not found
//
////////////////////////////////////////////////////////////////////////////////////////////////////
function FindLMSAPI
(
)
{
	var oWalkOpeners = window;
	var oWalkParents = window;
	
	try
	{
		// try to find the api - search parents recursively upwards from self, then
		// do the same with successive upward levels of opener windows
		while("object" == typeof(oWalkOpeners))
		{
			while("object" == typeof(oWalkParents))
			{
				if("object" == typeof(oWalkParents.API))
				{
					// We found it.
					return oWalkParents.API;
				}
				
				if(oWalkParents == oWalkParents.parent)
				{
					break;
				}
				oWalkParents = oWalkParents.parent;
			}
			
			if(oWalkOpeners == oWalkOpeners.opener)
			{
				break;
			}
			oWalkOpeners = oWalkOpeners.opener;
			oWalkParents = oWalkOpener;
		}
		
		// Couldn't find it.
		return null;
	}
	catch(e)
	{
		return null;
	}
}
