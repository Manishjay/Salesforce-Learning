import { LightningElement, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import uploadDocument from '@salesforce/apex/DocumentUploaderController.uploadDocument';

export default class DocumentUploader extends LightningElement {
    @api recordId;
    fileData;
    fileName;

    handleFileChange(event) {
        const file = event.target.files[0];
        if (file) {
            this.fileName = file.name;
            const reader = new FileReader();
            reader.onload = () => {
                const base64 = reader.result.split(',')[1];
               // console.log(base64); 
                this.fileData = {
                    filename: file.name,
                    base64: base64,
                    contentType: file.type
                };
            };
            reader.readAsDataURL(file);
        }
    }
    
    handleUpload() {
        if (this.fileData) {
            uploadDocument({ 
                base64Data: this.fileData.base64, 
                filename: this.fileData.filename, 
                contentType: this.fileData.contentType, 
                recordId: this.recordId 
            })
            .then(result => {
                console.log(result);
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Document uploaded successfully',
                        variant: 'success'
                    })
                );
                this.fileData = null;
                this.fileName = null; 
            })
            .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error uploading document',
                        message: error.body.message,
                        variant: 'error'
                    })
                );
            });
        } else {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error',
                    message: 'Please select a file to upload',
                    variant: 'error'
                })
            );
        }
    }
}
