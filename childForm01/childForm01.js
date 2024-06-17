import { LightningElement, track, api } from 'lwc';

export default class ChildForm extends LightningElement {
    @track name = '';
    @track email = '';

    @api isValid = false;

    handleNameChange(event) {
        this.name = event.target.value;
    }

    handleEmailChange(event) {
        this.email = event.target.value;
    }

    validateForm() {
        // Basic validation checks
        if (this.name.trim() && this.isValidEmail(this.email)) {
            this.isValid = true;
        } else {
            this.isValid = false;
        }
    }

    isValidEmail(email) {
        // Basic email format validation using regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}
