import { LightningElement, wire } from 'lwc';
import { publish, MessageContext } from 'lightning/messageService';
import FLIGHT_MESSAGE_CHANNEL from '@salesforce/messageChannel/FlightMessageChannel__c';

export default class FlightFilterComponent extends LightningElement {
    destination = '';
    origin = '';
    departureDate = null;
    returnDate = null;
    cabinClasses = [];
    directFlights = false;
    adults = 1;
    tripType = 'Round Trip';
    maxPrice = 1000;
    selectedPrice = 0;

    @wire(MessageContext)
    messageContext;

    handleInputChange(event) {
        const { name, value } = event.target;
        this[name] = value;
    }

    handleCheckboxChange(event) {
        const { name, checked } = event.target;
        this[name] = checked;
    }

    handleCabinClassChange(event) {
        const { name, checked } = event.target;
        if (checked) {
            this.cabinClasses.push(name);
        } else {
            this.cabinClasses = this.cabinClasses.filter(cls => cls !== name);
        }
    }

    handleSliderChange(event) {
        this.selectedPrice = event.target.value;
    }

    search() {
        const message = {
            origin: this.origin,
            destination: this.destination,
            departureDate: this.departureDate,
            returnDate: this.returnDate,
            cabinClasses: this.cabinClasses,
            directFlights: this.directFlights,
            adults: this.adults,
            tripType: this.tripType,
            maxPrice: this.selectedPrice
        };
        publish(this.messageContext, FLIGHT_MESSAGE_CHANNEL, message);
    }

    clearFilter() {
        this.origin = '';
        this.destination = '';
        this.departureDate = null;
        this.returnDate = null;
        this.cabinClasses = [];
        this.directFlights = false;
        this.adults = 1;
        this.tripType = 'Round Trip';
        this.selectedPrice = 0;

        this.search();
    }
}
