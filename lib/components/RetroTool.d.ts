import * as React from 'react';
import { IRetroToolProps } from './IRetroToolProps';
interface IColumn {
    id: string;
    header: string;
    placeholder: string;
}
interface ICard {
    id: string;
    text: string;
    columnId: string;
    order: number;
    isPrivate: boolean;
}
interface IRetroToolState {
    columns: IColumn[];
    cards: ICard[];
    privateCards: ICard[];
    currentCardId: number;
    showSettings: boolean;
    tempColumns: IColumn[];
}
export default class RetroTool extends React.Component<IRetroToolProps, IRetroToolState> {
    constructor(props: IRetroToolProps);
    private getDefaultColumns;
    private loadColumns;
    private saveColumns;
    private loadCards;
    private saveCards;
    private loadPrivateCards;
    private savePrivateCards;
    private getNextCardId;
    private saveNextCardId;
    private generateCardId;
    private addPrivateCard;
    private publishCard;
    private publishAllCards;
    private deleteCard;
    private deletePrivateCard;
    private moveCard;
    private moveColumn;
    private openSettings;
    private closeSettings;
    private saveSettings;
    private addColumnSetting;
    private deleteColumnSetting;
    private updateColumnSetting;
    private handleInputKeyPress;
    private renderCard;
    private renderColumn;
    private renderSettingsModal;
    private clearAllData;
    render(): React.ReactElement<IRetroToolProps>;
}
export {};
