import { LightningElement, api, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import uploadFile from '@salesforce/apex/FileUploaderController.uploadFile';
import fetchLogs from '@salesforce/apex/FileUploaderController.getLogs';

export default class FileUpload extends LightningElement {
    @api recordId;
    @track fileType = 'Files';
    @track folderId = '';
    @track selectedFile = null;
    @track selectedFileName = '';
    @track logs = [];
    @track columns = [
        { label: 'Uploaded By', fieldName: 'Uploaded_By__c' },
        { label: 'Upload Time', fieldName: 'Upload_Time__c', type: 'date' },
        { label: 'File Type', fieldName: 'File_Type__c' },
        { label: 'Status', fieldName: 'Status__c' }
    ];
    
    get fileTypeOptions() {
        return [
            { label: 'Files', value: 'Files' },
            { label: 'Documents', value: 'Documents' },
            { label: 'Attachments', value: 'Attachments' }
        ];
    }

    get acceptedFormats() {
        return '.pdf,.png,.jpg,.jpeg';
    }

    get isDocumentType() {
        return this.fileType === 'Documents';
    }

    handleFileTypeChange(event) {
        this.fileType = event.detail.value;
    }

    handleFolderIdChange(event) {
        this.folderId = event.target.value;
    }

    handleFileInputChange(event) {
        this.selectedFile = event.target.files[0];
        this.selectedFileName = this.selectedFile.name;
    }

    handleUpload() {
        if (!this.selectedFile) {
            this.showToast('Error', 'Please select a file to upload', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            const base64 = reader.result.split(',')[1];
            if (this.fileType === 'Files' || this.fileType === 'Attachments') {
                if (!this.recordId) {
                    this.showToast('Error', 'Record ID is required for Files and Attachments', 'error');
                    return;
                }
                uploadFile({
                    base64Data: base64,
                    filename: this.selectedFile.name,
                    uploadType: this.fileType,
                    recordId: this.recordId,
                    folderId: this.fileType === 'Documents' ? this.folderId : null
                })
                .then(result => {
                    this.showToast('Success', 'File uploaded successfully', 'success');
                    this.fetchLogs();
                    this.selectedFile = null;
                    this.selectedFileName = '';
                })
                .catch(error => {
                    this.showToast('Error uploading file', error.body.message, 'error');
                });
            } else {
                // Handle Documents or other types here if needed
            }
        };
        reader.readAsDataURL(this.selectedFile);
    }

    connectedCallback() {
        this.fetchLogs();
    }

    fetchLogs() {
        fetchLogs({ recordId: this.recordId })
            .then(result => {
                this.logs = result;
            })
            .catch(error => {
                this.showToast('Error fetching logs', error.body.message, 'error');
            });
    }

    showToast(title, message, variant) {
        const evt = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant
        });
        this.dispatchEvent(evt);
    }
}
