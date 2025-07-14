import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';

import * as strings from 'RetroToolWebPartStrings';
import { ErrorBoundary } from '../../components/ErrorBoundary';

// Enhanced module loading with comprehensive error handling
let RetroTool: any;
try {
  RetroTool = require('../../components/RetroTool').default;
  console.log('RetroTool component loaded successfully:', !!RetroTool);
  console.log('RetroTool component type:', typeof RetroTool);
} catch (error) {
  console.error('Failed to load RetroTool component:', error);
  console.error('Error details:', {
    name: error.name,
    message: error.message,
    stack: error.stack
  });
}

export interface IRetroToolWebPartProps {
  description: string;
}

class RetroToolWebPart extends BaseClientSideWebPart<IRetroToolWebPartProps> {

  private _isDarkTheme: boolean = false;
  private _environmentMessage: string = '';

  public render(): void {
    console.log('RetroTool WebPart render - Starting render');
    
    // Enhanced manifest validation with comprehensive logging
    const manifestId = this.manifest?.id;
    const manifestAlias = this.manifest?.alias;
    const manifestComponentType = this.manifest?.componentType;
    
    console.log('Manifest validation:', {
      hasManifest: !!this.manifest,
      manifestId,
      manifestAlias,
      manifestComponentType,
      manifestKeys: this.manifest ? Object.keys(this.manifest) : 'no manifest'
    });

    // Validate manifest properties
    if (!this.manifest) {
      console.error('Critical error: Web part manifest is undefined');
      this.domElement.innerHTML = this._renderErrorFallback('Web part manifest is undefined');
      return;
    }

    if (!manifestId) {
      console.error('Critical error: Web part manifest ID is undefined');
      this.domElement.innerHTML = this._renderErrorFallback('Web part manifest ID is undefined');
      return;
    }
    
    try {
      // Enhanced defensive checks for context properties
      const hasContext = !!this.context;
      const hasPageContext = !!(this.context && this.context.pageContext);
      const hasUser = !!(this.context && this.context.pageContext && this.context.pageContext.user);
      const hasTeamsContext = !!(this.context && this.context.sdks && this.context.sdks.microsoftTeams);
      const userDisplayName = hasUser 
        ? (this.context.pageContext.user.displayName || this.context.pageContext.user.loginName || 'User')
        : 'User';

      console.log('Context validation:', {
        hasContext,
        hasPageContext,
        hasUser,
        userDisplayName,
        hasTeamsContext,
        contextKeys: this.context ? Object.keys(this.context) : 'no context',
        pageContextKeys: hasPageContext ? Object.keys(this.context.pageContext) : 'no pageContext',
        userKeys: hasUser ? Object.keys(this.context.pageContext.user) : 'no user'
      });

      // Validate RetroTool component availability
      if (!RetroTool) {
        console.error('Critical error: RetroTool component is not available');
        this.domElement.innerHTML = this._renderErrorFallback('RetroTool component is not available');
        return;
      }

      // Validate component is a valid React component
      if (typeof RetroTool !== 'function') {
        console.error('Critical error: RetroTool is not a valid React component', typeof RetroTool);
        this.domElement.innerHTML = this._renderErrorFallback('RetroTool is not a valid React component');
        return;
      }

      const element: React.ReactElement = React.createElement(
        ErrorBoundary,
        {
          key: `error-boundary-${manifestId}` // Use manifest ID as key for uniqueness
        },
        React.createElement(
          RetroTool,
          {
            description: this.properties.description || 'RetroTool',
            isDarkTheme: this._isDarkTheme,
            environmentMessage: this._environmentMessage,
            hasTeamsContext: hasTeamsContext,
            userDisplayName: userDisplayName
          }
        )
      );

      ReactDom.render(element, this.domElement);
      console.log('RetroTool WebPart render - Render completed successfully');
    } catch (error) {
      console.error('Error rendering RetroTool web part:', error);
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
      console.error('Context state during error:', {
        hasContext: !!this.context,
        hasProperties: !!this.properties,
        hasDomElement: !!this.domElement,
        manifestId,
        manifestAlias
      });
      
      // Enhanced fallback error UI
      this.domElement.innerHTML = this._renderErrorFallback(error.toString());
    }
  }

  private _renderErrorFallback(errorMessage: string): string {
    return `
      <div style="padding: 20px; border: 2px solid #d13438; border-radius: 4px; background-color: #fdf2f2; margin: 10px 0;">
        <h2 style="color: #d13438; margin-top: 0;">⚠️ Failed to load RetroTool</h2>
        <p>There was an error initializing the web part.</p>
        <details style="margin-top: 10px;">
          <summary style="cursor: pointer;"><strong>Technical Details</strong></summary>
          <pre style="background: #f5f5f5; padding: 10px; border-radius: 4px; margin-top: 10px; overflow: auto; font-size: 12px; max-height: 200px;">${errorMessage}</pre>
          <div style="margin-top: 10px; font-size: 12px;">
            <strong>Debugging Information:</strong><br/>
            Manifest ID: ${this.manifest?.id || 'undefined'}<br/>
            Manifest Alias: ${this.manifest?.alias || 'undefined'}<br/>
            Component Type: ${this.manifest?.componentType || 'undefined'}<br/>
            Has Context: ${!!this.context}<br/>
            Has DOM Element: ${!!this.domElement}<br/>
            RetroTool Component: ${!!RetroTool ? 'loaded' : 'not loaded'}<br/>
            Component Type: ${typeof RetroTool}
          </div>
        </details>
        <button onclick="window.location.reload()" style="background: #0078d4; color: white; border: none; padding: 8px 16px; border-radius: 2px; cursor: pointer; margin-top: 10px;">
          🔄 Reload Page
        </button>
      </div>
    `;
  }

  protected onInit(): Promise<void> {
    console.log('RetroTool WebPart onInit - Starting initialization');
    
    // Enhanced manifest validation during initialization
    const manifestId = this.manifest?.id;
    const manifestAlias = this.manifest?.alias;
    const manifestComponentType = this.manifest?.componentType;
    
    console.log('Manifest validation during init:', {
      hasManifest: !!this.manifest,
      manifestId,
      manifestAlias,
      manifestComponentType,
      manifestObject: this.manifest
    });

    // Validate critical manifest properties
    if (!this.manifest) {
      const error = new Error('Web part manifest is undefined during initialization');
      console.error('Critical initialization error:', error);
      return Promise.reject(error);
    }

    if (!manifestId) {
      const error = new Error('Web part manifest ID is undefined during initialization');
      console.error('Critical initialization error:', error);
      return Promise.reject(error);
    }

    if (!manifestAlias) {
      const error = new Error('Web part manifest alias is undefined during initialization');
      console.error('Critical initialization error:', error);
      return Promise.reject(error);
    }
    
    try {
      this._environmentMessage = this._getEnvironmentMessage();
      console.log('Environment message set successfully:', this._environmentMessage);
      
      return super.onInit().then(() => {
        console.log('RetroTool WebPart onInit - Completed successfully');
        console.log('Context validation after init:', {
          hasContext: !!this.context,
          hasPageContext: !!(this.context && this.context.pageContext),
          hasUser: !!(this.context && this.context.pageContext && this.context.pageContext.user),
          contextKeys: this.context ? Object.keys(this.context) : 'no context',
          pageContextKeys: this.context?.pageContext ? Object.keys(this.context.pageContext) : 'no pageContext'
        });
        
        // Final validation before completion
        if (!this.context) {
          throw new Error('SharePoint context is not available after initialization');
        }
        
        console.log('RetroTool WebPart onInit - All validations passed');
      }).catch((error) => {
        console.error('Error in super.onInit():', error);
        console.error('Error details:', {
          name: error.name,
          message: error.message,
          stack: error.stack
        });
        throw error;
      });
    } catch (error) {
      console.error('Error during initialization:', error);
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
      return Promise.reject(error);
    }
  }

  private _getEnvironmentMessage(): string {
    try {
      if (!this.context) {
        console.warn('Context is not available during environment message detection');
        return 'Context not available';
      }

      if (this.context.sdks && this.context.sdks.microsoftTeams) { // running in Teams
        try {
          return this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentTeams : strings.AppTeamsTabEnvironment;
        } catch (teamsError) {
          console.error('Error accessing Teams context:', teamsError);
          return 'Teams environment (detection failed)';
        }
      }

      try {
        return this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentSharePoint : strings.AppSharePointEnvironment;
      } catch (spError) {
        console.error('Error accessing SharePoint context:', spError);
        return 'SharePoint environment (detection failed)';
      }
    } catch (error) {
      console.error('Error in _getEnvironmentMessage:', error);
      return 'Environment detection failed';
    }
  }

  protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {
    if (!currentTheme) {
      return;
    }

    this._isDarkTheme = !!currentTheme.isInverted;
    const {
      semanticColors
    } = currentTheme;

    if (semanticColors) {
      this.domElement.style.setProperty('--bodyText', semanticColors.bodyText || null);
      this.domElement.style.setProperty('--link', semanticColors.link || null);
      this.domElement.style.setProperty('--linkHovered', semanticColors.linkHovered || null);
    }
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}

// Enhanced module registration for SPFx
export default RetroToolWebPart;

// Explicit export for module registration with validation
export { RetroToolWebPart };

// Additional export validation for debugging
if (typeof RetroToolWebPart !== 'function') {
  console.error('Critical error: RetroToolWebPart is not a valid class/function');
} else {
  console.log('RetroToolWebPart class exported successfully');
}

// Ensure proper module.exports for CommonJS compatibility
if (typeof module !== 'undefined' && module.exports) {
  module.exports = RetroToolWebPart;
  module.exports.default = RetroToolWebPart;
  module.exports.RetroToolWebPart = RetroToolWebPart;
}