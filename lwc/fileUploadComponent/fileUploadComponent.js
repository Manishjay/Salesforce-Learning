import { LightningElement, api, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import linkFileToCase from '@salesforce/apex/CaseFileController.linkFileToCase';
import deleteFileFromCase from '@salesforce/apex/CaseFileController.deleteFileFromCase';
import getFilesForCase from '@salesforce/apex/CaseFileController.getFilesForCase';

export default class CaseFileComponent extends LightningElement {
    @api recordId;
    @track files;

    connectedCallback() {
        if (this.recordId) {
            this.loadFiles();
        }
    }

    loadFiles() {
        getFilesForCase({ caseId: this.recordId })
            .then(result => {
                this.files = result.map(link => ({
                    id: link.Id,
                    contentDocumentId: link.ContentDocumentId,
                    title: link.ContentDocument.Title,
                    size: link.ContentDocument.ContentSize,
                    fileExtension: link.ContentDocument.FileExtension,
                    downloadLink: this.documentDownloadLink(link.ContentDocumentId)
                }));
            })
            .catch(error => {
                this.showToast('Error loading files', error.body.message, 'error');
            });
    }

    handleUploadFinished(event) {
        const uploadedFiles = event.detail.files;
        const contentDocumentId = uploadedFiles[0].documentId;
        console.log(contentDocumentId); // 069J2000000mVGlIAM
        linkFileToCase({ contentDocumentId: contentDocumentId, caseId: this.recordId })
            .then(() => {
                this.showToast('Success', 'File uploaded and linked successfully', 'success');
                this.loadFiles();
            })
            .catch(error => {
                this.showToast('Error uploading file', error.body.message, 'error');
            });
    }

    deleteFile(event) {
        const contentDocumentLinkId = event.target.dataset.id;

        deleteFileFromCase({ contentDocumentLinkId })
            .then(() => {
                this.showToast('Success', 'File deleted successfully', 'success');
                this.loadFiles();
            })
            .catch(error => {
                this.showToast('Error deleting file', error.body.message, 'error');
            });
    }

    documentDownloadLink(contentDocumentId) {
        return `/sfc/servlet.shepherd/document/download/${contentDocumentId}`;
    }

    showToast(title, message, variant) {
        const evt = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
        });
        this.dispatchEvent(evt);
    }
}
