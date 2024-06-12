import { LightningElement, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import uploadAttachment from '@salesforce/apex/AttachmentController.uploadAttachment';

export default class AttachmentUploader extends LightningElement {
    @api recordId;
    fileData;
    fileName;

    handleFileChange(event) {
        const file = event.target.files[0];
        if (!file) return;

        this.fileName = file.name;
        const reader = new FileReader();
        reader.onload = (e) => {
            const fileContent = e.target.result;
            this.fileData = this.convertToBase64(fileContent);
        };
        reader.readAsDataURL(file);
    }

    convertToBase64(fileContent) {
        return fileContent.split(',')[1];
    }

    handleUpload() {
        if (this.fileData) {
            uploadAttachment({ 
                fileName: this.fileName, 
                base64Data: this.fileData, 
                recordId: this.recordId 
            })
            .then(() => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Attachment uploaded successfully',
                        variant: 'success'
                    })
                );
                this.fileData = null;
                this.fileName = null;
            })
            .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error uploading attachment',
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
