import { LightningElement, track } from 'lwc';

export default class ChildForm extends LightningElement {
    @track name = '';
    @track email = '';
    @track formStatus = '';

    handleNameChange(event) {
        this.name = event.target.value;
    }

    handleEmailChange(event) {
        this.email = event.target.value;
    }

    validateForm() {
        let isFormInvalid = false;

        // Basic validation checks
        if (!this.name.trim() || !this.email.trim()) {
            isFormInvalid = true;
            this.formStatus = 'Please fill in all required fields.';
        } else if (!this.isValidEmail(this.email)) {
            isFormInvalid = true;
            this.formStatus = 'Please enter a valid email address.';
        } else {
            this.formStatus = 'Form is valid.';
        }

        // Fire custom event to notify parent about form validity
        const event = new CustomEvent('formvaliditychange', {
            detail: { isFormInvalid, formStatus: this.formStatus }
        });
        this.dispatchEvent(event);
    }

    isValidEmail(email) {
        // Basic email format validation using regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);

    }
}
