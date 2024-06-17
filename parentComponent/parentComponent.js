import { LightningElement, track } from 'lwc';

export default class ParentComponent extends LightningElement {
    @track isFormInvalid = true;
    @track formStatus = '';

    handleFormValidityChange(event) {
        this.isFormInvalid = event.detail.isFormInvalid;
        this.formStatus = event.detail.formStatus;
    }

    handleSubmit() {
        // Perform form submission logic
        this.formStatus = 'Form submitted successfully!';
    }
}
