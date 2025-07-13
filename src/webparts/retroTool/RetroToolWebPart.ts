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
import RetroTool from '../../components/RetroTool';
import { IRetroToolProps } from '../../components/IRetroToolProps';
import { ErrorBoundary } from '../../components/ErrorBoundary';

export interface IRetroToolWebPartProps {
  description: string;
}

export default class RetroToolWebPart extends BaseClientSideWebPart<IRetroToolWebPartProps> {

  private _isDarkTheme: boolean = false;
  private _environmentMessage: string = '';

  public render(): void {
    try {
      const element: React.ReactElement = React.createElement(
        ErrorBoundary,
        {},
        React.createElement(
          RetroTool,
          {
            description: this.properties.description,
            isDarkTheme: this._isDarkTheme,
            environmentMessage: this._environmentMessage,
            hasTeamsContext: !!this.context.sdks.microsoftTeams,
            userDisplayName: this.context.pageContext.user.displayName
          }
        )
      );

      ReactDom.render(element, this.domElement);
    } catch (error) {
      console.error('Error rendering RetroTool web part:', error);
      
      // Fallback error UI
      this.domElement.innerHTML = `
        <div style="padding: 20px; border: 2px solid #d13438; border-radius: 4px; background-color: #fdf2f2; margin: 10px 0;">
          <h2 style="color: #d13438; margin-top: 0;">⚠️ Failed to load Retrospective Tool</h2>
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
    this._environmentMessage = this._getEnvironmentMessage();

    return super.onInit();
  }

  private _getEnvironmentMessage(): string {
    if (!!this.context.sdks.microsoftTeams) { // running in Teams
      return this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentTeams : strings.AppTeamsTabEnvironment;
    }

    return this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentSharePoint : strings.AppSharePointEnvironment;
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