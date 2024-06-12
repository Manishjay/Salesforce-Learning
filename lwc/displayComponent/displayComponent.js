import { LightningElement, wire } from 'lwc';
import { subscribe, MessageContext } from 'lightning/messageService';
import COUNTER_MESSAGE_CHANNEL from '@salesforce/messageChannel/CounterMessageChannel__c';

export default class DisplayComponent extends LightningElement {
    counterValue = 0;

    @wire(MessageContext)
    messageContext;

    connectedCallback() {
        this.subscribeToMessageChannel();
    }

    subscribeToMessageChannel() {
        subscribe(
            this.messageContext,
            COUNTER_MESSAGE_CHANNEL,
            (message) => this.handleMessage(message)
        );
    }

    handleMessage(message) {
        this.counterValue = message.value;
    }
}
