public class FileUploaderController {
    @AuraEnabled
    public static void uploadFile(String base64Data, String filename, String uploadType, Id recordId, Id folderId) {
        try {
            if (uploadType == 'Files') {
                uploadAsFile(base64Data, filename, recordId);
            } else if (uploadType == 'Documents') {
                uploadAsDocument(base64Data, filename, folderId);
            } else if (uploadType == 'Attachments') {
                uploadAsAttachment(base64Data, filename, recordId);
            } else {
                throw new AuraHandledException('Invalid upload type');
            }

            createLog(filename, uploadType, recordId, folderId, 'Success');
        } catch (Exception e) {
            createLog(filename, uploadType, recordId, folderId, 'Failed: ' + e.getMessage());
            throw new AuraHandledException(e.getMessage());
        }
    }

    private static void uploadAsFile(String base64Data, String filename, Id recordId) {
        ContentVersion contentVersion = new ContentVersion();
        contentVersion.Title = filename;
        contentVersion.PathOnClient = '/' + filename;
        contentVersion.VersionData = EncodingUtil.base64Decode(base64Data);
        insert contentVersion;

        ContentDocumentLink contentDocumentLink = new ContentDocumentLink();
        contentDocumentLink.ContentDocumentId = [SELECT ContentDocumentId FROM ContentVersion WHERE Id = :contentVersion.Id].ContentDocumentId;
        contentDocumentLink.LinkedEntityId = recordId;
        contentDocumentLink.ShareType = 'V';
        contentDocumentLink.Visibility = 'AllUsers';
        insert contentDocumentLink;
    }

    private static void uploadAsDocument(String base64Data, String filename, Id folderId) {
        Document doc = new Document();
        doc.Name = filename;
        doc.FolderId = folderId != null ? folderId : UserInfo.getUserId(); 
        doc.Body = EncodingUtil.base64Decode(base64Data);
        doc.ContentType = 'application/octet-stream';
        doc.IsPublic = false;
        insert doc;
    }

    private static void uploadAsAttachment(String base64Data, String filename, Id recordId) {
        Attachment attachment = new Attachment();
        attachment.Name = filename;
        attachment.Body = EncodingUtil.base64Decode(base64Data);
        attachment.ContentType = 'application/octet-stream';
        attachment.ParentId = recordId;
        insert attachment;
    }

    private static void createLog(String filename, String uploadType, Id recordId, Id folderId, String status) {
        File_Upload_Log__c log = new File_Upload_Log__c();
        //log.Name = filename;
        log.Uploaded_By__c = UserInfo.getUserId();
        log.Upload_Time__c = System.now();
        log.File_Type__c = uploadType;
        log.Record_ID__c = recordId;
        log.Folder_ID__c = folderId;
        log.Status__c = status;
        insert log;
    }
    
    @AuraEnabled
    public static List<File_Upload_Log__c> getLogs(Id recordId) {
        return [
            SELECT  Uploaded_By__c, Upload_Time__c, File_Type__c, Status__c 
            FROM File_Upload_Log__c 
            WHERE Record_ID__c = :recordId 
            ORDER BY Upload_Time__c DESC
        ];
    }
}
