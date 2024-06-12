import { LightningElement, api, track, wire } from 'lwc';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import CONTACT_OBJECT from '@salesforce/schema/contact';
import Gender_IDENTITY_FIELD from '@salesforce/schema/contact.GenderIdentity';
import saveMultipleContacts from '@salesforce/apex/CreateMultipleContactsController.saveMultipleContacts';


export default class CreateMultipleContaacts extends LightningElement {
   

    //This was a hard-coded data to show onto the UI of salesforce!

    // gender = [
    //     {label:"Male", value:"male"},
    //     {label:"Female", value:"female"}
    // ]


    // Here Salesforce data is being used!

    @api recordId;
    @track contacts = [];

    @wire(getObjectInfo, {objectApiName: CONTACT_OBJECT })
    contactObjectInfo;
    
    @wire(getPicklistValues,{recordTypeId: '$contactObjectInfo.data.defaultRecordTypeId', fieldApiName: Gender_IDENTITY_FIELD})
    genderPicklistValues;

    get getGenderPicklistValues(){
        return this.genderPicklistValues?.data?.values;
    }

    connectedCallback(){
        this.addNewHandler();
    } 

    addNewHandler(){
        this.contacts.push({
            tempId: Date.now()
        })
    }

    deleteHandler(event){
        if(this.contacts.length == 1){
            this.showToast("You cannot Delete now!");
            return; 
        }
        let tempId = event.target?.dataset.tempId;
        this.contacts = this.contacts.filter(a => a.tempId != tempId);
    }
    
    elementChangeHandler(event){
        let contactRow = this.contacts.find(a => a.tempId == event.target.dataset.tempId);
        if(contactRow){
            contactRow[event.target.name] = event.target?.value;
        }
    }

    // async submitClickHandler(event){
    //     const allValid = this.checkControlsVisibilty();
    //     if(allValid){
    //         this.contacts.forEach(a => a.AccountId = this.recordId);
    //         let response = await saveMultipleContacts({contacts : this.contacts});
    //         if(response.isSuccess){
    //             this.showToast('Contacts saved successfully');
    //         }
    //         else{
    //             this.showToast('Something went wrong while saving contacts: ' + response.message);
    //         }
    //     }
    //     else{
    //         this.showToast('Attention Required!');
    //     }
    // }


    submitClickHandler(event) {
        const allValid = this.checkControlsVisibilty();
        if (allValid) {
            this.contacts.forEach(a => a.AccountId = this.recordId);
            saveMultipleContacts({ contacts: this.contacts })
                .then(response => {
                    if (response.isSuccess) {
                        this.showToast('Contacts saved successfully');
                    } else {
                        this.showToast('Something went wrong while saving contacts: ' + response.message);
                    }
                })
                .catch(error => {
                    console.error('Error saving contacts:', error);l
                    this.showToast('An error occurred while saving contacts.');
                });
        } else {
            this.showToast('Attention Required!');
        }
    }


    checkControlsVisibilty(){
        let isValid = true, controls = this.template.querySelectorAll('lightning-input, lightning-combobox');
        controls.forEach(field => {
            if(!field.checkValidity()){
                field.reportValidity();
                isValid = false;
            }
        });
        return isValid;
    }

    showToast(message, title = 'Error', variant = 'error'){
        const event = new ShowToastEvent({
            title,
            message,
            variant
        });
        this.dispatchEvent(event);
    }
}
