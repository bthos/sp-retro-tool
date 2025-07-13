---
description: AI rules derived by SpecStory from the project AI interaction history
globs: *
---

## <headers/>

## PROJECT DOCUMENTATION & CONTEXT SYSTEM

## TECH STACK

## CODING STANDARDS

## DEBUGGING

When debugging SPFx web part errors, especially those involving "Cannot read properties of undefined," consider the following steps:

1.  **Manifest ID Validation:** Ensure the manifest ID is a valid GUID and that it matches across all relevant files (e.g., web part manifest and `package-solution.json`). Use a GUID generator to create a new ID if necessary and update the manifest file. The original code was trying to access `this.context.pageContext.user.displayName` without checking if these nested objects existed, which would cause the "Cannot read properties of undefined" error when the SharePoint context wasn't fully initialized or available. The previously used test GUID `a1b2c3d4-e5f6-7890-abcd-ef1234567890` should be replaced with a proper GUID like `7d2ba4b4-85b7-4b1c-a885-70aa27badb44`.
2.  **Defensive Checks:** Implement defensive checks to handle potential undefined values, especially when accessing properties like `this.context.pageContext.user`. Add checks to ensure that `pageContext` and `user` are defined before accessing their properties.  Use fallback values for `userDisplayName` and `hasTeamsContext`. Context validation should check if `this.context` exists and PageContext validation should check if `this.context.pageContext` exists and User object validation should check if `this.context.pageContext.user` exists.
3.  **Error Handling:** Add error handling in key methods like `onInit` and any methods that fetch data or interact with SharePoint context. This will help catch issues during initialization and provide more informative error messages. Use try-catch blocks around critical initialization code, better logging for debugging, and proper promise error handling.
4.  **Manifest Cleanup:** Remove old or conflicting manifest files to avoid issues with module loading.
5.  **Module Loading Issues:** The error "Cannot read properties of undefined (reading 'id')" often occurs in SPFx when there's a mismatch between the manifest ID and how the module is being loaded. Implement comprehensive logging to track manifest ID, alias, and component type during initialization. Add validation checks to ensure the web part manifest properties are properly loaded. Consider changing from static import to dynamic `require()` to catch module loading issues. Add defensive checks to ensure the component is available before attempting to render.
6. **Enhanced Error Handling in the Render Method**: Add comprehensive defensive checks for the SharePoint context properties that were causing the "Cannot read properties of undefined (reading 'id')" error. Use fallback values for all potentially undefined properties and comprehensive logging of context state during initialization and rendering.
7. **Fixed Environment Message Detection**: Update `_getEnvironmentMessage()` method with context existence validation, error handling for Teams SDK access, and fallback error messages.
8. **Console Logging**: Add detailed console logging to help debug context-related issues during web part initialization and rendering. This includes logging manifest ID, alias, and component type during initialization.
9. **Manifest and Module Loading Diagnostics**: Add comprehensive logging to track manifest ID, alias, and component type during initialization. Add validation checks to ensure the web part manifest properties are properly loaded.
10. **Component Import Strategy**: Change from static import to dynamic `require()` to catch module loading issues. Add defensive checks to ensure the component is available before attempting to render.
11. **Robust Context and Properties Validation**: Enhance all SharePoint context property access with defensive programming. Add fallback values for all potentially undefined properties. Ensure comprehensive logging of context state during initialization and rendering.
12. **Clean Manifest ID**: Ensure the web part has a fresh, valid GUID and that there are no conflicts with old manifest files. Update the solution ID in the `package-solution.json` file to match the new web part manifest GUID.
13. **Production-Ready Build Process**: Perform complete clean rebuilds to eliminate any cached artifacts.
14. **Enhanced Error Handling and Debugging**: Add try-catch blocks around all critical initialization points. Provide detailed console logging for troubleshooting deployment issues. Ensure comprehensive error reporting in fallback UI.

## WORKFLOW & RELEASE RULES

When deploying a new SPFx package:

1.  Upload the new package (`.sppkg`).
2.  Monitor the browser console for detailed logging output.
3.  Clear the browser cache to ensure the new assets are loaded.
4.  Remove old web part instances and add fresh instances.
5.  Ensure the GUID in `package-solution.json` matches the new web part manifest GUID. This is important for consistency and to avoid potential conflicts.
6.  When updating the solution name, check for references to the old solution name throughout the codebase and update them to the new name. To maintain consistency, the solution should be called "RetroTool" everywhere.

## REFERENCES
[https://learn.microsoft.com/en-us/answers/questions/2184648/unable-to-load-spfx-webpart-after-deploy](https://learn.microsoft.com/en-us/answers/questions/2184648/unable-to-load-spfx-webpart-after-deploy)