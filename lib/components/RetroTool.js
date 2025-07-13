var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import * as React from 'react';
import styles from './RetroTool.module.scss';
var RetroTool = /** @class */ (function (_super) {
    __extends(RetroTool, _super);
    function RetroTool(props) {
        var _this = _super.call(this, props) || this;
        // Add private card
        _this.addPrivateCard = function (columnId, text) {
            if (text.trim() === '')
                return;
            var newCard = {
                id: _this.generateCardId(),
                text: text.trim(),
                columnId: columnId,
                order: _this.state.privateCards.filter(function (card) { return card.columnId === columnId; }).length,
                isPrivate: true
            };
            _this.setState(function (prevState) { return ({
                privateCards: __spreadArray(__spreadArray([], prevState.privateCards, true), [newCard], false)
            }); }, function () {
                _this.savePrivateCards();
            });
        };
        // Publish card
        _this.publishCard = function (cardId) {
            var privateCard = _this.state.privateCards.find(function (card) { return card.id === cardId; });
            if (!privateCard)
                return;
            var newCard = __assign(__assign({}, privateCard), { isPrivate: false, order: _this.state.cards.filter(function (card) { return card.columnId === privateCard.columnId; }).length });
            _this.setState(function (prevState) { return ({
                cards: __spreadArray(__spreadArray([], prevState.cards, true), [newCard], false),
                privateCards: prevState.privateCards.filter(function (card) { return card.id !== cardId; })
            }); }, function () {
                _this.saveCards();
                _this.savePrivateCards();
            });
        };
        // Publish all cards for a column
        _this.publishAllCards = function (columnId) {
            var columnPrivateCards = _this.state.privateCards.filter(function (card) { return card.columnId === columnId; });
            var newCards = columnPrivateCards.map(function (card, index) { return (__assign(__assign({}, card), { isPrivate: false, order: _this.state.cards.filter(function (c) { return c.columnId === columnId; }).length + index })); });
            _this.setState(function (prevState) { return ({
                cards: __spreadArray(__spreadArray([], prevState.cards, true), newCards, true),
                privateCards: prevState.privateCards.filter(function (card) { return card.columnId !== columnId; })
            }); }, function () {
                _this.saveCards();
                _this.savePrivateCards();
            });
        };
        // Delete card
        _this.deleteCard = function (cardId) {
            if (confirm('Are you sure you want to delete this card?')) {
                _this.setState(function (prevState) { return ({
                    cards: prevState.cards.filter(function (card) { return card.id !== cardId; })
                }); }, function () {
                    _this.saveCards();
                });
            }
        };
        // Delete private card
        _this.deletePrivateCard = function (cardId) {
            _this.setState(function (prevState) { return ({
                privateCards: prevState.privateCards.filter(function (card) { return card.id !== cardId; })
            }); }, function () {
                _this.savePrivateCards();
            });
        };
        // Move card up/down
        _this.moveCard = function (cardId, direction) {
            var cards = __spreadArray([], _this.state.cards, true);
            var cardIndex = cards.findIndex(function (card) { return card.id === cardId; });
            if (cardIndex === -1)
                return;
            var card = cards[cardIndex];
            var columnCards = cards.filter(function (c) { return c.columnId === card.columnId; }).sort(function (a, b) { return a.order - b.order; });
            var cardPositionInColumn = columnCards.findIndex(function (c) { return c.id === cardId; });
            if (direction === 'up' && cardPositionInColumn > 0) {
                var swapCard = columnCards[cardPositionInColumn - 1];
                var tempOrder = card.order;
                card.order = swapCard.order;
                swapCard.order = tempOrder;
            }
            else if (direction === 'down' && cardPositionInColumn < columnCards.length - 1) {
                var swapCard = columnCards[cardPositionInColumn + 1];
                var tempOrder = card.order;
                card.order = swapCard.order;
                swapCard.order = tempOrder;
            }
            _this.setState({ cards: cards }, function () {
                _this.saveCards();
            });
        };
        // Move column left/right
        _this.moveColumn = function (columnId, direction) {
            var _a, _b;
            var columns = __spreadArray([], _this.state.columns, true);
            var columnIndex = columns.findIndex(function (col) { return col.id === columnId; });
            if (columnIndex === -1)
                return;
            if (direction === 'left' && columnIndex > 0) {
                _a = [columns[columnIndex - 1], columns[columnIndex]], columns[columnIndex] = _a[0], columns[columnIndex - 1] = _a[1];
            }
            else if (direction === 'right' && columnIndex < columns.length - 1) {
                _b = [columns[columnIndex + 1], columns[columnIndex]], columns[columnIndex] = _b[0], columns[columnIndex + 1] = _b[1];
            }
            _this.setState({ columns: columns }, function () {
                _this.saveColumns();
            });
        };
        // Open settings modal
        _this.openSettings = function () {
            _this.setState({
                showSettings: true,
                tempColumns: __spreadArray([], _this.state.columns, true)
            });
        };
        // Close settings modal
        _this.closeSettings = function () {
            _this.setState({ showSettings: false });
        };
        // Save settings
        _this.saveSettings = function () {
            _this.setState({
                columns: __spreadArray([], _this.state.tempColumns, true),
                showSettings: false
            }, function () {
                _this.saveColumns();
            });
        };
        // Add column setting
        _this.addColumnSetting = function () {
            var newColumn = {
                id: "column-".concat(Date.now()),
                header: 'New Column',
                placeholder: 'Enter your thoughts…'
            };
            _this.setState(function (prevState) { return ({
                tempColumns: __spreadArray(__spreadArray([], prevState.tempColumns, true), [newColumn], false)
            }); });
        };
        // Delete column setting
        _this.deleteColumnSetting = function (columnId) {
            _this.setState(function (prevState) { return ({
                tempColumns: prevState.tempColumns.filter(function (col) { return col.id !== columnId; })
            }); });
        };
        // Update column setting
        _this.updateColumnSetting = function (columnId, field, value) {
            _this.setState(function (prevState) { return ({
                tempColumns: prevState.tempColumns.map(function (col) {
                    var _a;
                    return col.id === columnId ? __assign(__assign({}, col), (_a = {}, _a[field] = value, _a)) : col;
                })
            }); });
        };
        // Handle input key press
        _this.handleInputKeyPress = function (e, columnId) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                var target = e.target;
                _this.addPrivateCard(columnId, target.value);
                target.value = '';
            }
        };
        // Render card
        _this.renderCard = function (card, isPrivate) {
            if (isPrivate === void 0) { isPrivate = false; }
            return (React.createElement("div", { key: card.id, className: "".concat(styles.card, " ").concat(isPrivate ? styles.privateCard : '') },
                React.createElement("div", { className: styles.cardContent }, card.text),
                React.createElement("div", { className: styles.cardActions }, isPrivate ? (React.createElement(React.Fragment, null,
                    React.createElement("button", { className: "".concat(styles.btn, " ").concat(styles.btnSmall, " ").concat(styles.btnPrimary), onClick: function () { return _this.publishCard(card.id); }, title: "Publish" },
                        React.createElement("i", { className: "fas fa-upload" })),
                    React.createElement("button", { className: "".concat(styles.btn, " ").concat(styles.btnSmall, " ").concat(styles.btnSecondary), onClick: function () { return _this.deletePrivateCard(card.id); }, title: "Delete" },
                        React.createElement("i", { className: "fas fa-trash" })))) : (React.createElement(React.Fragment, null,
                    React.createElement("button", { className: "".concat(styles.btn, " ").concat(styles.btnSmall, " ").concat(styles.btnSecondary), onClick: function () { return _this.moveCard(card.id, 'up'); }, title: "Move Up" },
                        React.createElement("i", { className: "fas fa-chevron-up" })),
                    React.createElement("button", { className: "".concat(styles.btn, " ").concat(styles.btnSmall, " ").concat(styles.btnSecondary), onClick: function () { return _this.moveCard(card.id, 'down'); }, title: "Move Down" },
                        React.createElement("i", { className: "fas fa-chevron-down" })),
                    React.createElement("button", { className: "".concat(styles.btn, " ").concat(styles.btnSmall, " ").concat(styles.btnSecondary), onClick: function () { return _this.deleteCard(card.id); }, title: "Delete" },
                        React.createElement("i", { className: "fas fa-trash" })))))));
        };
        // Render column
        _this.renderColumn = function (column) {
            var publicCards = _this.state.cards.filter(function (card) { return card.columnId === column.id; }).sort(function (a, b) { return a.order - b.order; });
            var privateCards = _this.state.privateCards.filter(function (card) { return card.columnId === column.id; });
            return (React.createElement("div", { key: column.id, className: styles.column },
                React.createElement("div", { className: styles.columnHeader },
                    React.createElement("div", null,
                        React.createElement("div", { className: styles.columnTitle }, column.header),
                        React.createElement("div", { className: styles.columnPlaceholder }, column.placeholder)),
                    React.createElement("div", { className: styles.columnActions },
                        React.createElement("button", { className: "".concat(styles.btn, " ").concat(styles.btnSmall, " ").concat(styles.btnSecondary), onClick: function () { return _this.moveColumn(column.id, 'left'); }, title: "Move Left" },
                            React.createElement("i", { className: "fas fa-chevron-left" })),
                        React.createElement("button", { className: "".concat(styles.btn, " ").concat(styles.btnSmall, " ").concat(styles.btnSecondary), onClick: function () { return _this.moveColumn(column.id, 'right'); }, title: "Move Right" },
                            React.createElement("i", { className: "fas fa-chevron-right" })))),
                React.createElement("div", { className: styles.columnBody }, publicCards.length === 0 ? (React.createElement("div", { className: styles.emptyState },
                    React.createElement("i", { className: "fas fa-comment fa-2x" }),
                    React.createElement("div", null, "No cards yet."))) : (publicCards.map(function (card) { return _this.renderCard(card); }))),
                React.createElement("div", { className: styles.privateSection },
                    React.createElement("div", { className: styles.privateSectionHeader },
                        React.createElement("i", { className: "fas fa-lock" }),
                        React.createElement("span", null, "Private Section"),
                        privateCards.length > 0 && (React.createElement("button", { className: "".concat(styles.btn, " ").concat(styles.btnSmall, " ").concat(styles.btnPrimary), onClick: function () { return _this.publishAllCards(column.id); } }, "Publish All"))),
                    React.createElement("div", { className: styles.privateCards }, privateCards.map(function (card) { return _this.renderCard(card, true); })),
                    React.createElement("textarea", { className: styles.newCardInput, placeholder: "Type here\u2026 Press Enter to save.", onKeyPress: function (e) { return _this.handleInputKeyPress(e, column.id); } }))));
        };
        // Render settings modal
        _this.renderSettingsModal = function () {
            if (!_this.state.showSettings)
                return null;
            return (React.createElement("div", { className: styles.modal },
                React.createElement("div", { className: styles.modalContent },
                    React.createElement("div", { className: styles.modalHeader },
                        React.createElement("h2", null, "Column Settings"),
                        React.createElement("button", { className: styles.closeBtn, onClick: _this.closeSettings }, "\u00D7")),
                    React.createElement("div", { className: styles.modalBody },
                        React.createElement("div", { className: styles.columnSettings }, _this.state.tempColumns.map(function (column) { return (React.createElement("div", { key: column.id, className: styles.columnSetting },
                            React.createElement("input", { type: "text", value: column.header, onChange: function (e) { return _this.updateColumnSetting(column.id, 'header', e.target.value); }, placeholder: "Column Header" }),
                            React.createElement("input", { type: "text", value: column.placeholder, onChange: function (e) { return _this.updateColumnSetting(column.id, 'placeholder', e.target.value); }, placeholder: "Placeholder Text" }),
                            React.createElement("button", { className: "".concat(styles.btn, " ").concat(styles.btnSmall, " ").concat(styles.btnSecondary), onClick: function () { return _this.deleteColumnSetting(column.id); } },
                                React.createElement("i", { className: "fas fa-trash" })))); })),
                        React.createElement("button", { className: "".concat(styles.btn, " ").concat(styles.btnPrimary), onClick: _this.addColumnSetting },
                            React.createElement("i", { className: "fas fa-plus" }),
                            " Add Column")),
                    React.createElement("div", { className: styles.modalFooter },
                        React.createElement("button", { className: "".concat(styles.btn, " ").concat(styles.btnPrimary), onClick: _this.saveSettings }, "Save Settings"),
                        React.createElement("button", { className: "".concat(styles.btn, " ").concat(styles.btnSecondary), onClick: _this.closeSettings }, "Cancel")))));
        };
        _this.state = {
            columns: _this.loadColumns(),
            cards: _this.loadCards(),
            privateCards: _this.loadPrivateCards(),
            currentCardId: _this.getNextCardId(),
            showSettings: false,
            tempColumns: []
        };
        return _this;
    }
    // Default column configuration
    RetroTool.prototype.getDefaultColumns = function () {
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
    };
    // Load columns from localStorage or use defaults
    RetroTool.prototype.loadColumns = function () {
        try {
            var saved = localStorage.getItem('retro-columns');
            return saved ? JSON.parse(saved) : this.getDefaultColumns();
        }
        catch (error) {
            console.error('Error loading columns from localStorage:', error);
            return this.getDefaultColumns();
        }
    };
    // Save columns to localStorage
    RetroTool.prototype.saveColumns = function () {
        try {
            localStorage.setItem('retro-columns', JSON.stringify(this.state.columns));
        }
        catch (error) {
            console.error('Error saving columns to localStorage:', error);
        }
    };
    // Load cards from localStorage
    RetroTool.prototype.loadCards = function () {
        try {
            var saved = localStorage.getItem('retro-cards');
            return saved ? JSON.parse(saved) : [];
        }
        catch (error) {
            console.error('Error loading cards from localStorage:', error);
            return [];
        }
    };
    // Save cards to localStorage
    RetroTool.prototype.saveCards = function () {
        try {
            localStorage.setItem('retro-cards', JSON.stringify(this.state.cards));
        }
        catch (error) {
            console.error('Error saving cards to localStorage:', error);
        }
    };
    // Load private cards from localStorage
    RetroTool.prototype.loadPrivateCards = function () {
        try {
            var saved = localStorage.getItem('retro-private-cards');
            return saved ? JSON.parse(saved) : [];
        }
        catch (error) {
            console.error('Error loading private cards from localStorage:', error);
            return [];
        }
    };
    // Save private cards to localStorage
    RetroTool.prototype.savePrivateCards = function () {
        try {
            localStorage.setItem('retro-private-cards', JSON.stringify(this.state.privateCards));
        }
        catch (error) {
            console.error('Error saving private cards to localStorage:', error);
        }
    };
    // Get next card ID
    RetroTool.prototype.getNextCardId = function () {
        try {
            var saved = localStorage.getItem('retro-next-card-id');
            return saved ? parseInt(saved) : 1;
        }
        catch (error) {
            console.error('Error loading next card ID from localStorage:', error);
            return 1;
        }
    };
    // Save next card ID
    RetroTool.prototype.saveNextCardId = function () {
        try {
            localStorage.setItem('retro-next-card-id', this.state.currentCardId.toString());
        }
        catch (error) {
            console.error('Error saving next card ID to localStorage:', error);
        }
    };
    // Generate unique card ID
    RetroTool.prototype.generateCardId = function () {
        var _this = this;
        var id = "card-".concat(this.state.currentCardId);
        this.setState({ currentCardId: this.state.currentCardId + 1 }, function () {
            _this.saveNextCardId();
        });
        return id;
    };
    // Clear all localStorage data (useful for debugging)
    RetroTool.prototype.clearAllData = function () {
        try {
            localStorage.removeItem('retro-columns');
            localStorage.removeItem('retro-cards');
            localStorage.removeItem('retro-private-cards');
            localStorage.removeItem('retro-next-card-id');
            // Reset state to defaults
            this.setState({
                columns: this.getDefaultColumns(),
                cards: [],
                privateCards: [],
                currentCardId: 1,
                showSettings: false,
                tempColumns: []
            });
            console.log('All retro data cleared successfully');
        }
        catch (error) {
            console.error('Error clearing retro data:', error);
        }
    };
    RetroTool.prototype.render = function () {
        var _this = this;
        return (React.createElement("div", { className: styles.retroToolContainer },
            React.createElement("div", { className: styles.header },
                React.createElement("h1", null, "Retrospective Board"),
                React.createElement("div", { className: styles.headerActions },
                    React.createElement("button", { className: "".concat(styles.btn, " ").concat(styles.btnSecondary), onClick: this.openSettings },
                        React.createElement("i", { className: "fas fa-cog" }),
                        " Settings"))),
            React.createElement("div", { className: styles.columnsContainer }, this.state.columns.map(function (column) { return _this.renderColumn(column); })),
            this.renderSettingsModal()));
    };
    return RetroTool;
}(React.Component));
export default RetroTool;
//# sourceMappingURL=RetroTool.js.map