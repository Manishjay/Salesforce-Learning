import { LightningElement, wire } from 'lwc';
import { publish, MessageContext } from 'lightning/messageService';
import COUNTER_MESSAGE_CHANNEL from '@salesforce/messageChannel/CounterMessageChannel__c';

export default class CounterComponent extends LightningElement {
    counter = 0;

    @wire(MessageContext)
    messageContext;

    incrementCounter() {
        this.counter++;
        this.publishCounterValue();
    }

    decrementCounter() {
        this.counter--;
        this.publishCounterValue();
    }

    publishCounterValue() {
        const message = { value: this.counter };
        publish(this.messageContext, COUNTER_MESSAGE_CHANNEL, message);
    }
}
