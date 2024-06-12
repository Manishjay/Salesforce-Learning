import { LightningElement, wire, track } from 'lwc';
import { publish, MessageContext } from 'lightning/messageService';
import FOOD_MESSAGE_CHANNEL from '@salesforce/messageChannel/FilterMessageChannel__c';

export default class FoodFilterComponent extends LightningElement {
    searchTerm = '';
    isVeg = false;
    isNonVeg = false;
    selectedPrice = 0;
    maxPrice = 500;

    @wire(MessageContext)
    messageContext;

    handleKeywordChange(event) {
        this.searchTerm = event.target.value;
        this.search();
    }

    handleCheckboxChange(event) {
        const { name, checked } = event.target;
        if (name === 'Veg') {
            this.isVeg = checked;
        } else if (name === 'Non-Veg') {
            this.isNonVeg = checked;
        }
        this.search();
    }

    handleSliderChange(event) {
        this.selectedPrice = event.target.value;
    }

    search() {
        const selectedCategories = [];
        if (this.isVeg) {
            selectedCategories.push('Veg');
        }
        if (this.isNonVeg) {
            selectedCategories.push('Non-Veg');
        }

        const message = {
            searchTerm: this.searchTerm,
            selectedCategories: selectedCategories,
            selectedPrice: this.selectedPrice
        };

        publish(this.messageContext, FOOD_MESSAGE_CHANNEL, message);
    }

    clearFilter() {
        this.searchTerm = '';
        this.isVeg = false;
        this.isNonVeg = false;
        this.selectedPrice = this.maxPrice;

        this.search();
    }

    showAddForm() {
        const message = {
            action: 'showAddForm'
        };
        publish(this.messageContext, FOOD_MESSAGE_CHANNEL, message);
    }
}
