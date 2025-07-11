import * as React from 'react';
import { IRetroToolProps } from './IRetroToolProps';
import styles from './RetroTool.module.scss';

// Interfaces
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

  constructor(props: IRetroToolProps) {
    super(props);
    
    this.state = {
      columns: this.loadColumns(),
      cards: this.loadCards(),
      privateCards: this.loadPrivateCards(),
      currentCardId: this.getNextCardId(),
      showSettings: false,
      tempColumns: []
    };
  }

  // Default column configuration
  private getDefaultColumns(): IColumn[] {
    return [
      {
        id: 'start',
        header: 'Start',
        placeholder: 'Things the team should try…'
      },
      {
        id: 'stop',
        header: 'Stop',
        placeholder: 'Things the team should stop doing…'
      },
      {
        id: 'continue',
        header: 'Continue',
        placeholder: 'Things that worked well…'
      }
    ];
  }

  // Load columns from localStorage or use defaults
  private loadColumns(): IColumn[] {
    const saved = localStorage.getItem('retro-columns');
    return saved ? JSON.parse(saved) : this.getDefaultColumns();
  }

  // Save columns to localStorage
  private saveColumns(): void {
    localStorage.setItem('retro-columns', JSON.stringify(this.state.columns));
  }

  // Load cards from localStorage
  private loadCards(): ICard[] {
    const saved = localStorage.getItem('retro-cards');
    return saved ? JSON.parse(saved) : [];
  }

  // Save cards to localStorage
  private saveCards(): void {
    localStorage.setItem('retro-cards', JSON.stringify(this.state.cards));
  }

  // Load private cards from localStorage
  private loadPrivateCards(): ICard[] {
    const saved = localStorage.getItem('retro-private-cards');
    return saved ? JSON.parse(saved) : [];
  }

  // Save private cards to localStorage
  private savePrivateCards(): void {
    localStorage.setItem('retro-private-cards', JSON.stringify(this.state.privateCards));
  }

  // Get next card ID
  private getNextCardId(): number {
    const saved = localStorage.getItem('retro-next-card-id');
    return saved ? parseInt(saved) : 1;
  }

  // Save next card ID
  private saveNextCardId(): void {
    localStorage.setItem('retro-next-card-id', this.state.currentCardId.toString());
  }

  // Generate unique card ID
  private generateCardId(): string {
    const id = `card-${this.state.currentCardId}`;
    this.setState({ currentCardId: this.state.currentCardId + 1 }, () => {
      this.saveNextCardId();
    });
    return id;
  }

  // Add private card
  private addPrivateCard = (columnId: string, text: string): void => {
    if (text.trim() === '') return;

    const newCard: ICard = {
      id: this.generateCardId(),
      text: text.trim(),
      columnId,
      order: this.state.privateCards.filter(card => card.columnId === columnId).length,
      isPrivate: true
    };

    this.setState(prevState => ({
      privateCards: [...prevState.privateCards, newCard]
    }), () => {
      this.savePrivateCards();
    });
  }

  // Publish card
  private publishCard = (cardId: string): void => {
    const privateCard = this.state.privateCards.find(card => card.id === cardId);
    if (!privateCard) return;

    const newCard: ICard = {
      ...privateCard,
      isPrivate: false,
      order: this.state.cards.filter(card => card.columnId === privateCard.columnId).length
    };

    this.setState(prevState => ({
      cards: [...prevState.cards, newCard],
      privateCards: prevState.privateCards.filter(card => card.id !== cardId)
    }), () => {
      this.saveCards();
      this.savePrivateCards();
    });
  }

  // Publish all cards for a column
  private publishAllCards = (columnId: string): void => {
    const columnPrivateCards = this.state.privateCards.filter(card => card.columnId === columnId);
    const newCards = columnPrivateCards.map((card, index) => ({
      ...card,
      isPrivate: false,
      order: this.state.cards.filter(c => c.columnId === columnId).length + index
    }));

    this.setState(prevState => ({
      cards: [...prevState.cards, ...newCards],
      privateCards: prevState.privateCards.filter(card => card.columnId !== columnId)
    }), () => {
      this.saveCards();
      this.savePrivateCards();
    });
  }

  // Delete card
  private deleteCard = (cardId: string): void => {
    if (confirm('Are you sure you want to delete this card?')) {
      this.setState(prevState => ({
        cards: prevState.cards.filter(card => card.id !== cardId)
      }), () => {
        this.saveCards();
      });
    }
  }

  // Delete private card
  private deletePrivateCard = (cardId: string): void => {
    this.setState(prevState => ({
      privateCards: prevState.privateCards.filter(card => card.id !== cardId)
    }), () => {
      this.savePrivateCards();
    });
  }

  // Move card up/down
  private moveCard = (cardId: string, direction: 'up' | 'down'): void => {
    const cards = [...this.state.cards];
    const cardIndex = cards.findIndex(card => card.id === cardId);
    if (cardIndex === -1) return;

    const card = cards[cardIndex];
    const columnCards = cards.filter(c => c.columnId === card.columnId).sort((a, b) => a.order - b.order);
    const cardPositionInColumn = columnCards.findIndex(c => c.id === cardId);

    if (direction === 'up' && cardPositionInColumn > 0) {
      const swapCard = columnCards[cardPositionInColumn - 1];
      const tempOrder = card.order;
      card.order = swapCard.order;
      swapCard.order = tempOrder;
    } else if (direction === 'down' && cardPositionInColumn < columnCards.length - 1) {
      const swapCard = columnCards[cardPositionInColumn + 1];
      const tempOrder = card.order;
      card.order = swapCard.order;
      swapCard.order = tempOrder;
    }

    this.setState({ cards }, () => {
      this.saveCards();
    });
  }

  // Move column left/right
  private moveColumn = (columnId: string, direction: 'left' | 'right'): void => {
    const columns = [...this.state.columns];
    const columnIndex = columns.findIndex(col => col.id === columnId);
    if (columnIndex === -1) return;

    if (direction === 'left' && columnIndex > 0) {
      [columns[columnIndex], columns[columnIndex - 1]] = [columns[columnIndex - 1], columns[columnIndex]];
    } else if (direction === 'right' && columnIndex < columns.length - 1) {
      [columns[columnIndex], columns[columnIndex + 1]] = [columns[columnIndex + 1], columns[columnIndex]];
    }

    this.setState({ columns }, () => {
      this.saveColumns();
    });
  }

  // Open settings modal
  private openSettings = (): void => {
    this.setState({ 
      showSettings: true,
      tempColumns: [...this.state.columns]
    });
  }

  // Close settings modal
  private closeSettings = (): void => {
    this.setState({ showSettings: false });
  }

  // Save settings
  private saveSettings = (): void => {
    this.setState({ 
      columns: [...this.state.tempColumns],
      showSettings: false 
    }, () => {
      this.saveColumns();
    });
  }

  // Add column setting
  private addColumnSetting = (): void => {
    const newColumn: IColumn = {
      id: `column-${Date.now()}`,
      header: 'New Column',
      placeholder: 'Enter your thoughts…'
    };

    this.setState(prevState => ({
      tempColumns: [...prevState.tempColumns, newColumn]
    }));
  }

  // Delete column setting
  private deleteColumnSetting = (columnId: string): void => {
    this.setState(prevState => ({
      tempColumns: prevState.tempColumns.filter(col => col.id !== columnId)
    }));
  }

  // Update column setting
  private updateColumnSetting = (columnId: string, field: 'header' | 'placeholder', value: string): void => {
    this.setState(prevState => ({
      tempColumns: prevState.tempColumns.map(col => 
        col.id === columnId ? { ...col, [field]: value } : col
      )
    }));
  }

  // Handle input key press
  private handleInputKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>, columnId: string): void => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const target = e.target as HTMLTextAreaElement;
      this.addPrivateCard(columnId, target.value);
      target.value = '';
    }
  }

  // Render card
  private renderCard = (card: ICard, isPrivate: boolean = false): JSX.Element => {
    return (
      <div key={card.id} className={`${styles.card} ${isPrivate ? styles.privateCard : ''}`}>
        <div className={styles.cardContent}>{card.text}</div>
        <div className={styles.cardActions}>
          {isPrivate ? (
            <>
              <button 
                className={`${styles.btn} ${styles.btnSmall} ${styles.btnPrimary}`}
                onClick={() => this.publishCard(card.id)}
                title="Publish"
              >
                <i className="fas fa-upload"></i>
              </button>
              <button 
                className={`${styles.btn} ${styles.btnSmall} ${styles.btnSecondary}`}
                onClick={() => this.deletePrivateCard(card.id)}
                title="Delete"
              >
                <i className="fas fa-trash"></i>
              </button>
            </>
          ) : (
            <>
              <button 
                className={`${styles.btn} ${styles.btnSmall} ${styles.btnSecondary}`}
                onClick={() => this.moveCard(card.id, 'up')}
                title="Move Up"
              >
                <i className="fas fa-chevron-up"></i>
              </button>
              <button 
                className={`${styles.btn} ${styles.btnSmall} ${styles.btnSecondary}`}
                onClick={() => this.moveCard(card.id, 'down')}
                title="Move Down"
              >
                <i className="fas fa-chevron-down"></i>
              </button>
              <button 
                className={`${styles.btn} ${styles.btnSmall} ${styles.btnSecondary}`}
                onClick={() => this.deleteCard(card.id)}
                title="Delete"
              >
                <i className="fas fa-trash"></i>
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  // Render column
  private renderColumn = (column: IColumn): JSX.Element => {
    const publicCards = this.state.cards.filter(card => card.columnId === column.id).sort((a, b) => a.order - b.order);
    const privateCards = this.state.privateCards.filter(card => card.columnId === column.id);

    return (
      <div key={column.id} className={styles.column}>
        <div className={styles.columnHeader}>
          <div>
            <div className={styles.columnTitle}>{column.header}</div>
            <div className={styles.columnPlaceholder}>{column.placeholder}</div>
          </div>
          <div className={styles.columnActions}>
            <button 
              className={`${styles.btn} ${styles.btnSmall} ${styles.btnSecondary}`}
              onClick={() => this.moveColumn(column.id, 'left')}
              title="Move Left"
            >
              <i className="fas fa-chevron-left"></i>
            </button>
            <button 
              className={`${styles.btn} ${styles.btnSmall} ${styles.btnSecondary}`}
              onClick={() => this.moveColumn(column.id, 'right')}
              title="Move Right"
            >
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
        
        <div className={styles.columnBody}>
          {publicCards.length === 0 ? (
            <div className={styles.emptyState}>
              <i className="fas fa-comment fa-2x"></i>
              <div>No cards yet.</div>
            </div>
          ) : (
            publicCards.map(card => this.renderCard(card))
          )}
        </div>
        
        <div className={styles.privateSection}>
          <div className={styles.privateSectionHeader}>
            <i className="fas fa-lock"></i>
            <span>Private Section</span>
            {privateCards.length > 0 && (
              <button 
                className={`${styles.btn} ${styles.btnSmall} ${styles.btnPrimary}`}
                onClick={() => this.publishAllCards(column.id)}
              >
                Publish All
              </button>
            )}
          </div>
          
          <div className={styles.privateCards}>
            {privateCards.map(card => this.renderCard(card, true))}
          </div>
          
          <textarea
            className={styles.newCardInput}
            placeholder="Type here… Press Enter to save."
            onKeyPress={(e) => this.handleInputKeyPress(e, column.id)}
          />
        </div>
      </div>
    );
  }

  // Render settings modal
  private renderSettingsModal = (): JSX.Element => {
    if (!this.state.showSettings) return null;

    return (
      <div className={styles.modal}>
        <div className={styles.modalContent}>
          <div className={styles.modalHeader}>
            <h2>Column Settings</h2>
            <button className={styles.closeBtn} onClick={this.closeSettings}>&times;</button>
          </div>
          
          <div className={styles.modalBody}>
            <div className={styles.columnSettings}>
              {this.state.tempColumns.map(column => (
                <div key={column.id} className={styles.columnSetting}>
                  <input
                    type="text"
                    value={column.header}
                    onChange={(e) => this.updateColumnSetting(column.id, 'header', e.target.value)}
                    placeholder="Column Header"
                  />
                  <input
                    type="text"
                    value={column.placeholder}
                    onChange={(e) => this.updateColumnSetting(column.id, 'placeholder', e.target.value)}
                    placeholder="Placeholder Text"
                  />
                  <button 
                    className={`${styles.btn} ${styles.btnSmall} ${styles.btnSecondary}`}
                    onClick={() => this.deleteColumnSetting(column.id)}
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              ))}
            </div>
            
            <button 
              className={`${styles.btn} ${styles.btnPrimary}`}
              onClick={this.addColumnSetting}
            >
              <i className="fas fa-plus"></i> Add Column
            </button>
          </div>
          
          <div className={styles.modalFooter}>
            <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={this.saveSettings}>
              Save Settings
            </button>
            <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={this.closeSettings}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  public render(): React.ReactElement<IRetroToolProps> {
    return (
      <div className={styles.retroToolContainer}>
        <div className={styles.header}>
          <h1>Retrospective Board</h1>
          <div className={styles.headerActions}>
            <button 
              className={`${styles.btn} ${styles.btnSecondary}`}
              onClick={this.openSettings}
            >
              <i className="fas fa-cog"></i> Settings
            </button>
          </div>
        </div>
        
        <div className={styles.columnsContainer}>
          {this.state.columns.map(column => this.renderColumn(column))}
        </div>
        
        {this.renderSettingsModal()}
      </div>
    );
  }
}