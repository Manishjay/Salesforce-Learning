import { LightningElement, track } from 'lwc';

export default class ParentComponent extends LightningElement {
    @track childFormValid = false;
    @track formStatus = '';

    handleFormValidityChange(event) {
        this.childFormValid = event.detail.isValid;
        this.formStatus = event.detail.formStatus;
    }

    handleSubmit() {
        // Perform form submission logic
        this.formStatus = 'Form submitted successfully!';
    }
}
