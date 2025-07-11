// Retrospective Tool JavaScript
class RetroTool {
    constructor() {
        this.columns = this.loadColumns();
        this.cards = this.loadCards();
        this.privateCards = this.loadPrivateCards();
        this.currentCardId = this.getNextCardId();
        
        this.init();
    }

    // Default column configuration
    getDefaultColumns() {
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

    // Initialize the application
    init() {
        this.renderColumns();
        this.bindEvents();
    }

    // Load columns from localStorage or use defaults
    loadColumns() {
        const saved = localStorage.getItem('retro-columns');
        return saved ? JSON.parse(saved) : this.getDefaultColumns();
    }

    // Save columns to localStorage
    saveColumns() {
        localStorage.setItem('retro-columns', JSON.stringify(this.columns));
    }

    // Load cards from localStorage
    loadCards() {
        const saved = localStorage.getItem('retro-cards');
        return saved ? JSON.parse(saved) : [];
    }

    // Save cards to localStorage
    saveCards() {
        localStorage.setItem('retro-cards', JSON.stringify(this.cards));
    }

    // Load private cards from localStorage
    loadPrivateCards() {
        const saved = localStorage.getItem('retro-private-cards');
        return saved ? JSON.parse(saved) : [];
    }

    // Save private cards to localStorage
    savePrivateCards() {
        localStorage.setItem('retro-private-cards', JSON.stringify(this.privateCards));
    }

    // Get next card ID
    getNextCardId() {
        const saved = localStorage.getItem('retro-next-card-id');
        return saved ? parseInt(saved) : 1;
    }

    // Save next card ID
    saveNextCardId() {
        localStorage.setItem('retro-next-card-id', this.currentCardId.toString());
    }

    // Generate unique card ID
    generateCardId() {
        const id = `card-${this.currentCardId}`;
        this.currentCardId++;
        this.saveNextCardId();
        return id;
    }

    // Render all columns
    renderColumns() {
        const container = document.getElementById('columns-container');
        container.innerHTML = '';

        this.columns.forEach(column => {
            const columnElement = this.createColumnElement(column);
            container.appendChild(columnElement);
        });
    }

    // Create column element
    createColumnElement(column) {
        const columnDiv = document.createElement('div');
        columnDiv.className = 'column';
        columnDiv.dataset.columnId = column.id;

        const publicCards = this.cards.filter(card => card.columnId === column.id);
        const privateCards = this.privateCards.filter(card => card.columnId === column.id);

        columnDiv.innerHTML = `
            <div class="column-header">
                <div>
                    <div class="column-title">${column.header}</div>
                    <div class="column-placeholder">${column.placeholder}</div>
                </div>
                <div class="column-actions">
                    <button class="btn btn-small btn-secondary move-left" title="Move Left">
                        <i class="fas fa-chevron-left"></i>
                    </button>
                    <button class="btn btn-small btn-secondary move-right" title="Move Right">
                        <i class="fas fa-chevron-right"></i>
                    </button>
                </div>
            </div>
            <div class="column-body">
                ${publicCards.length === 0 ? this.createEmptyState() : ''}
                ${publicCards.sort((a, b) => a.order - b.order).map(card => this.createCardHTML(card)).join('')}
            </div>
            <div class="private-section">
                <div class="private-section-header">
                    <i class="fas fa-lock lock-icon"></i>
                    <span>Private Section</span>
                    ${privateCards.length > 0 ? `<button class="btn btn-small btn-primary publish-all-btn" data-column-id="${column.id}">Publish All</button>` : ''}
                </div>
                <div class="private-cards">
                    ${privateCards.map(card => this.createPrivateCardHTML(card)).join('')}
                </div>
                <textarea class="new-card-input" placeholder="Type here… Press Enter to save." data-column-id="${column.id}"></textarea>
            </div>
        `;

        return columnDiv;
    }

    // Create empty state HTML
    createEmptyState() {
        return `
            <div class="empty-state">
                <i class="fas fa-comment empty-icon"></i>
                <div>No cards yet.</div>
            </div>
        `;
    }

    // Create card HTML
    createCardHTML(card) {
        return `
            <div class="card" data-card-id="${card.id}" draggable="true">
                <div class="card-content">${card.text}</div>
                <div class="card-actions">
                    <button class="btn btn-small btn-secondary move-up" title="Move Up">
                        <i class="fas fa-chevron-up"></i>
                    </button>
                    <button class="btn btn-small btn-secondary move-down" title="Move Down">
                        <i class="fas fa-chevron-down"></i>
                    </button>
                    <button class="btn btn-small btn-secondary delete-card" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    }

    // Create private card HTML
    createPrivateCardHTML(card) {
        return `
            <div class="card private-card" data-card-id="${card.id}">
                <div class="card-content">${card.text}</div>
                <div class="card-actions">
                    <button class="btn btn-small btn-primary publish-card" title="Publish">
                        <i class="fas fa-upload"></i>
                    </button>
                    <button class="btn btn-small btn-secondary delete-private-card" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    }

    // Bind event listeners
    bindEvents() {
        // Settings button
        document.getElementById('settings-btn').addEventListener('click', () => this.openSettings());

        // Modal close buttons
        document.querySelector('.close-btn').addEventListener('click', () => this.closeSettings());
        document.getElementById('cancel-settings-btn').addEventListener('click', () => this.closeSettings());

        // Save settings
        document.getElementById('save-settings-btn').addEventListener('click', () => this.saveSettings());

        // Add column button
        document.getElementById('add-column-btn').addEventListener('click', () => this.addColumnSetting());

        // Delegate events for dynamic content
        document.addEventListener('click', (e) => this.handleClick(e));
        document.addEventListener('keydown', (e) => this.handleKeydown(e));
        document.addEventListener('dragstart', (e) => this.handleDragStart(e));
        document.addEventListener('dragover', (e) => this.handleDragOver(e));
        document.addEventListener('drop', (e) => this.handleDrop(e));
    }

    // Handle click events
    handleClick(e) {
        if (e.target.closest('.move-left')) {
            this.moveColumn(e.target.closest('.column').dataset.columnId, 'left');
        } else if (e.target.closest('.move-right')) {
            this.moveColumn(e.target.closest('.column').dataset.columnId, 'right');
        } else if (e.target.closest('.move-up')) {
            this.moveCard(e.target.closest('.card').dataset.cardId, 'up');
        } else if (e.target.closest('.move-down')) {
            this.moveCard(e.target.closest('.card').dataset.cardId, 'down');
        } else if (e.target.closest('.delete-card')) {
            this.deleteCard(e.target.closest('.card').dataset.cardId);
        } else if (e.target.closest('.delete-private-card')) {
            this.deletePrivateCard(e.target.closest('.card').dataset.cardId);
        } else if (e.target.closest('.publish-card')) {
            this.publishCard(e.target.closest('.card').dataset.cardId);
        } else if (e.target.closest('.publish-all-btn')) {
            this.publishAllCards(e.target.dataset.columnId);
        } else if (e.target.closest('.delete-column-btn')) {
            this.deleteColumnSetting(e.target.closest('.column-setting').dataset.columnId);
        }
    }

    // Handle keydown events
    handleKeydown(e) {
        if (e.target.classList.contains('new-card-input') && e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            this.addPrivateCard(e.target.dataset.columnId, e.target.value.trim());
            e.target.value = '';
        }
    }

    // Handle drag start
    handleDragStart(e) {
        if (e.target.classList.contains('card')) {
            e.dataTransfer.setData('text/plain', e.target.dataset.cardId);
            e.target.classList.add('dragging');
        }
    }

    // Handle drag over
    handleDragOver(e) {
        e.preventDefault();
        const column = e.target.closest('.column');
        if (column) {
            column.classList.add('drag-over');
        }
    }

    // Handle drop
    handleDrop(e) {
        e.preventDefault();
        const column = e.target.closest('.column');
        if (column) {
            column.classList.remove('drag-over');
            const cardId = e.dataTransfer.getData('text/plain');
            const targetColumnId = column.dataset.columnId;
            this.moveCardToColumn(cardId, targetColumnId);
        }
        document.querySelectorAll('.card').forEach(card => card.classList.remove('dragging'));
    }

    // Add private card
    addPrivateCard(columnId, text) {
        if (!text) return;

        const card = {
            id: this.generateCardId(),
            text: text,
            columnId: columnId,
            order: this.privateCards.filter(c => c.columnId === columnId).length
        };

        this.privateCards.push(card);
        this.savePrivateCards();
        this.renderColumns();
    }

    // Publish card
    publishCard(cardId) {
        const cardIndex = this.privateCards.findIndex(c => c.id === cardId);
        if (cardIndex === -1) return;

        const card = this.privateCards[cardIndex];
        const publicCard = {
            ...card,
            id: this.generateCardId(),
            order: this.cards.filter(c => c.columnId === card.columnId).length
        };

        this.cards.push(publicCard);
        this.privateCards.splice(cardIndex, 1);
        this.saveCards();
        this.savePrivateCards();
        this.renderColumns();
    }

    // Publish all cards in a column
    publishAllCards(columnId) {
        const columnPrivateCards = this.privateCards.filter(c => c.columnId === columnId);
        const startOrder = this.cards.filter(c => c.columnId === columnId).length;

        columnPrivateCards.forEach((card, index) => {
            const publicCard = {
                ...card,
                id: this.generateCardId(),
                order: startOrder + index
            };
            this.cards.push(publicCard);
        });

        this.privateCards = this.privateCards.filter(c => c.columnId !== columnId);
        this.saveCards();
        this.savePrivateCards();
        this.renderColumns();
    }

    // Delete card
    deleteCard(cardId) {
        this.cards = this.cards.filter(c => c.id !== cardId);
        this.saveCards();
        this.renderColumns();
    }

    // Delete private card
    deletePrivateCard(cardId) {
        this.privateCards = this.privateCards.filter(c => c.id !== cardId);
        this.savePrivateCards();
        this.renderColumns();
    }

    // Move card up/down
    moveCard(cardId, direction) {
        const card = this.cards.find(c => c.id === cardId);
        if (!card) return;

        const columnCards = this.cards.filter(c => c.columnId === card.columnId).sort((a, b) => a.order - b.order);
        const currentIndex = columnCards.findIndex(c => c.id === cardId);

        if (direction === 'up' && currentIndex > 0) {
            const swapCard = columnCards[currentIndex - 1];
            const tempOrder = card.order;
            card.order = swapCard.order;
            swapCard.order = tempOrder;
        } else if (direction === 'down' && currentIndex < columnCards.length - 1) {
            const swapCard = columnCards[currentIndex + 1];
            const tempOrder = card.order;
            card.order = swapCard.order;
            swapCard.order = tempOrder;
        }

        this.saveCards();
        this.renderColumns();
    }

    // Move column left/right
    moveColumn(columnId, direction) {
        const currentIndex = this.columns.findIndex(c => c.id === columnId);
        if (currentIndex === -1) return;

        if (direction === 'left' && currentIndex > 0) {
            [this.columns[currentIndex], this.columns[currentIndex - 1]] = [this.columns[currentIndex - 1], this.columns[currentIndex]];
        } else if (direction === 'right' && currentIndex < this.columns.length - 1) {
            [this.columns[currentIndex], this.columns[currentIndex + 1]] = [this.columns[currentIndex + 1], this.columns[currentIndex]];
        }

        this.saveColumns();
        this.renderColumns();
    }

    // Move card to different column
    moveCardToColumn(cardId, targetColumnId) {
        const card = this.cards.find(c => c.id === cardId);
        if (!card || card.columnId === targetColumnId) return;

        card.columnId = targetColumnId;
        card.order = this.cards.filter(c => c.columnId === targetColumnId).length;

        this.saveCards();
        this.renderColumns();
    }

    // Open settings modal
    openSettings() {
        this.renderColumnSettings();
        document.getElementById('settings-modal').classList.add('show');
    }

    // Close settings modal
    closeSettings() {
        document.getElementById('settings-modal').classList.remove('show');
    }

    // Render column settings
    renderColumnSettings() {
        const container = document.getElementById('column-settings');
        container.innerHTML = '';

        this.columns.forEach(column => {
            const settingDiv = document.createElement('div');
            settingDiv.className = 'column-setting';
            settingDiv.dataset.columnId = column.id;

            settingDiv.innerHTML = `
                <div class="column-setting-header">
                    <div class="column-setting-title">Column: ${column.header}</div>
                    <button class="btn btn-small btn-secondary delete-column-btn" title="Delete Column">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                <div class="form-group">
                    <label>Header:</label>
                    <input type="text" class="column-header-input" value="${column.header}">
                </div>
                <div class="form-group">
                    <label>Placeholder:</label>
                    <input type="text" class="column-placeholder-input" value="${column.placeholder}">
                </div>
            `;

            container.appendChild(settingDiv);
        });
    }

    // Add column setting
    addColumnSetting() {
        const newColumn = {
            id: `column-${Date.now()}`,
            header: 'New Column',
            placeholder: 'Add your placeholder text here…'
        };

        this.columns.push(newColumn);
        this.renderColumnSettings();
    }

    // Delete column setting
    deleteColumnSetting(columnId) {
        if (this.columns.length <= 1) {
            alert('You must have at least one column.');
            return;
        }

        this.columns = this.columns.filter(c => c.id !== columnId);
        this.cards = this.cards.filter(c => c.columnId !== columnId);
        this.privateCards = this.privateCards.filter(c => c.columnId !== columnId);
        this.renderColumnSettings();
    }

    // Save settings
    saveSettings() {
        const settings = document.querySelectorAll('.column-setting');
        const updatedColumns = [];

        settings.forEach(setting => {
            const columnId = setting.dataset.columnId;
            const header = setting.querySelector('.column-header-input').value.trim();
            const placeholder = setting.querySelector('.column-placeholder-input').value.trim();

            if (header) {
                updatedColumns.push({
                    id: columnId,
                    header: header,
                    placeholder: placeholder || 'Add your notes here…'
                });
            }
        });

        if (updatedColumns.length === 0) {
            alert('You must have at least one column with a header.');
            return;
        }

        this.columns = updatedColumns;
        this.saveColumns();
        this.saveCards();
        this.savePrivateCards();
        this.renderColumns();
        this.closeSettings();
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new RetroTool();
});