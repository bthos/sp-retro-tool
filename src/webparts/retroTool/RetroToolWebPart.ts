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

// Dynamic import to ensure proper module loading
let RetroTool: any;
try {
  RetroTool = require('../../components/RetroTool').default;
  console.log('RetroTool component loaded successfully:', !!RetroTool);
} catch (error) {
  console.error('Failed to load RetroTool component:', error);
}

export interface IRetroToolWebPartProps {
  description: string;
}

export default class RetroToolWebPart extends BaseClientSideWebPart<IRetroToolWebPartProps> {

  private _isDarkTheme: boolean = false;
  private _environmentMessage: string = '';

  public render(): void {
    console.log('RetroTool WebPart render - Starting render');
    console.log('Manifest ID during render:', this.manifest?.id);
    
    try {
      // Add defensive checks for context properties
      const hasTeamsContext = !!(this.context && this.context.sdks && this.context.sdks.microsoftTeams);
      const userDisplayName = this.context && this.context.pageContext && this.context.pageContext.user 
        ? (this.context.pageContext.user.displayName || this.context.pageContext.user.loginName || 'User')
        : 'User';

      console.log('RetroTool WebPart render - Context check:', {
        hasContext: !!this.context,
        hasPageContext: !!(this.context && this.context.pageContext),
        hasUser: !!(this.context && this.context.pageContext && this.context.pageContext.user),
        userDisplayName,
        hasTeamsContext,
        manifestId: this.manifest?.id
      });

      if (!RetroTool) {
        throw new Error('RetroTool component is not available');
      }

      const element: React.ReactElement = React.createElement(
        ErrorBoundary,
        {},
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
      console.error('Error stack:', error.stack);
      console.error('Context state:', {
        hasContext: !!this.context,
        hasProperties: !!this.properties,
        hasDomElement: !!this.domElement,
        manifestId: this.manifest?.id
      });
      
      // Fallback error UI
      this.domElement.innerHTML = `
        <div style="padding: 20px; border: 2px solid #d13438; border-radius: 4px; background-color: #fdf2f2; margin: 10px 0;">
          <h2 style="color: #d13438; margin-top: 0;">⚠️ Failed to load RetroTool</h2>
          <p>There was an error initializing the web part.</p>
          <details style="margin-top: 10px;">
            <summary style="cursor: pointer;"><strong>Technical Details</strong></summary>
            <pre style="background: #f5f5f5; padding: 10px; border-radius: 4px; margin-top: 10px; overflow: auto;">${error.toString()}</pre>
          </details>
          <button onclick="window.location.reload()" style="background: #0078d4; color: white; border: none; padding: 8px 16px; border-radius: 2px; cursor: pointer; margin-top: 10px;">
            🔄 Reload Page
          </button>
        </div>
      `;
    }
  }

  protected onInit(): Promise<void> {
    console.log('RetroTool WebPart onInit - Starting initialization');
    console.log('Web Part ID from manifest:', this.manifest?.id);
    console.log('Web Part alias from manifest:', this.manifest?.alias);
    console.log('Component type from manifest:', this.manifest?.componentType);
    console.log('Manifest object:', this.manifest);
    
    try {
      this._environmentMessage = this._getEnvironmentMessage();
      console.log('RetroTool WebPart onInit - Environment message set:', this._environmentMessage);
      
      return super.onInit().then(() => {
        console.log('RetroTool WebPart onInit - Completed successfully');
        console.log('Context after init:', {
          hasContext: !!this.context,
          hasPageContext: !!(this.context && this.context.pageContext),
          hasUser: !!(this.context && this.context.pageContext && this.context.pageContext.user),
          contextKeys: this.context ? Object.keys(this.context) : 'no context'
        });
      }).catch((error) => {
        console.error('RetroTool WebPart onInit - Error in super.onInit():', error);
        throw error;
      });
    } catch (error) {
      console.error('RetroTool WebPart onInit - Error during initialization:', error);
      console.error('Error stack:', error.stack);
      return Promise.reject(error);
    }
  }

  private _getEnvironmentMessage(): string {
    try {
      if (!this.context) {
        console.warn('RetroTool WebPart - Context is not available');
        return 'Context not available';
      }

      if (this.context.sdks && this.context.sdks.microsoftTeams) { // running in Teams
        return this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentTeams : strings.AppTeamsTabEnvironment;
      }

      return this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentSharePoint : strings.AppSharePointEnvironment;
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

// Explicit export for module registration
export { RetroToolWebPart };