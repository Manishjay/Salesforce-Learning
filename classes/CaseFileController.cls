public with sharing class CaseFileController {

    @AuraEnabled(cacheable=true)
    public static List<ContentDocumentLink> getFilesForCase(Id caseId) {
        try {
            return [SELECT Id, ContentDocumentId, ContentDocument.Title, ContentDocument.ContentSize, ContentDocument.FileExtension 
                    FROM ContentDocumentLink 
                    WHERE LinkedEntityId = :caseId];
        } catch (Exception e) {
            throw new AuraHandledException('Error loading files: ' + e.getMessage());
        }
    }

    @AuraEnabled
    public static void deleteFileFromCase(Id contentDocumentLinkId) {
        try {
            ContentDocumentLink linkToDelete = [SELECT Id FROM ContentDocumentLink WHERE Id = :contentDocumentLinkId LIMIT 1];
            delete linkToDelete;
        } catch (Exception e) {
            throw new AuraHandledException('Error deleting file: ' + e.getMessage());
        }
    }

    @AuraEnabled
    public static void linkFileToCase(Id contentDocumentId, Id caseId) {
        try {
            // Check if the file is already linked to the case
            List<ContentDocumentLink> existingLinks = [
                SELECT Id 
                FROM ContentDocumentLink 
                WHERE ContentDocumentId = :contentDocumentId
                AND LinkedEntityId = :caseId
            ];

            // If no existing link, create a new link
            if (existingLinks.isEmpty()) {
                ContentDocumentLink link = new ContentDocumentLink();
                link.ContentDocumentId = contentDocumentId;
                link.LinkedEntityId = caseId;
                link.ShareType = 'I'; // Set the appropriate ShareType (e.g., 'I' for Inferred)
                insert link;
            } else {
                throw new AuraHandledException('File is already linked to this case.ln43');
            }
        } catch (DmlException dmlEx) {
            throw new AuraHandledException('Error while linking file ln45: ' + dmlEx.getMessage());
        } catch (Exception ex) {
            throw new AuraHandledException('Error while linking file ln48: ' + ex.getMessage());
           
        }
    }
}
