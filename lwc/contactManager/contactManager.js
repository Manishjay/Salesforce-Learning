import { LightningElement, track } from 'lwc';
import getContacts from '@salesforce/apex/ContactController.getContacts';
import upsertContact from '@salesforce/apex/ContactController.upsertContact';
import deleteContact from '@salesforce/apex/ContactController.deleteContact';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

const columns = [
    { label: 'First Name', fieldName: 'FirstName', editable: true },
    { label: 'Last Name', fieldName: 'LastName', editable: true },
    { label: 'Email', fieldName: 'Email', editable: true },
    {
        type: 'button-icon', 
        typeAttributes: { 
            iconName: 'utility:delete', 
            name: 'delete', 
            title: 'Delete', 
            variant: 'border-filled', 
            alternativeText: 'Delete'
        }
    }
];

export default class ContactManager extends LightningElement {
    @track contacts;
    @track showModal = false;
    @track draftValues = [];
    firstName;
    lastName;
    email;

    columns = columns;

    connectedCallback() {
        this.loadContacts();
    }

    // Loading contacts with promise handling
    loadContacts() {
        getContacts()
            .then(result => {
                this.contacts = result;
            })
            .catch(error => {
                console.error('Error fetching contacts:', error);
            });
    }

    // Opening the modal for creating a new contact
    openCreateModal() {
        this.showModal = true;
    }

    // Closing the modal
    closeModal() {
        this.showModal = false;
    }

    // Handling input changes in the modal
    handleInputChange(event) {
        const field = event.target.dataset.id;
        if (field === 'firstName') {
            this.firstName = event.target.value;
        } else if (field === 'lastName') {
            this.lastName = event.target.value;
        } else if (field === 'email') {
            this.email = event.target.value;
        }
    }

    // Creating a new contact with promise handling
    createContact() {
        const newContact = {
            FirstName: this.firstName,
            LastName: this.lastName,
            Email: this.email
        };

        upsertContact({ contact: newContact })
            .then(result => {
                this.contacts = [...this.contacts, result];
                this.closeModal();
            })
            .catch(error => {
                console.error('Error creating contact:', error);
            });
    }

    // Handling save operation in the datatable
    handleSave(event) {
        const updatedFields = event.detail.draftValues;
        
        const upsertPromises = updatedFields.map(field => {
            return upsertContact({ contact: field });
        });

        Promise.all(upsertPromises)
            .then(() => {
                this.loadContacts();
                this.draftValues = [];
            })
            .catch(error => {
                console.error('Error updating contacts:', error);
            });
    }

    // Handling row actions like delete
    handleRowAction(event) {
        const actionName = event.detail.action.name;
        const row = event.detail.row;

        if (actionName === 'delete') {
            deleteContact({ contactId: row.Id })
                .then(() => {
                    this.loadContacts();
                })
                .catch(error => {
                    console.error('Error deleting contact:', error);
                });
        }
    }

    
}
