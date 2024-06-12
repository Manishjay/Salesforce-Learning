import { LightningElement, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import uploadDocument from '@salesforce/apex/DocumentUploaderController.uploadDocument';

export default class DocumentUploader extends LightningElement {
    
    @track files = [];

    handleFileChange(event) {
        const selectedFiles = Array.from(event.target.files);
        this.files = selectedFiles.map(file => ({
            name: file.name,
            content: null,
            base64: null,
            contentType: file.type,
            isUploading: false,
            uploadProgress: 0
        }));

        selectedFiles.forEach(file => {
            const reader = new FileReader();
            reader.onload = () => {
                const base64 = reader.result.split(',')[1];
                this.files = this.files.map(f => 
                    f.name === file.name ? { ...f, content: reader.result, base64: base64 } : f
                );
            };
            reader.readAsDataURL(file);
        });
    }

    handleUpload() {
        if (this.files.length === 0) {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error',
                    message: 'Please select files to upload',
                    variant: 'error'
                })
            );
            return;
        }

        this.uploadNextFile(0);
    }

    uploadNextFile(index) {
        if (index >= this.files.length) {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Documents uploaded successfully',
                    variant: 'success'
                })
            );
            this.files = [];
            return;
        }

        const file = this.files[index];
        file.isUploading = true;
        file.uploadProgress = 0;

        this.files = [...this.files]; 

        // Simulate upload progress
        const simulateProgress = () => {
            if (file.uploadProgress < 100) {
                file.uploadProgress += 10;
                this.files = [...this.files]; 
                setTimeout(simulateProgress, 100);
            } else {
                uploadDocument({
                    base64Data: file.base64,
                    filename: file.name,
                    contentType: file.contentType,
                    // recordId: this.recordId
                })
                .then(() => {
                    file.isUploading = false;
                    this.files = [...this.files]; 
                    this.uploadNextFile(index + 1);
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
            }
        };
        simulateProgress();
    }
}


