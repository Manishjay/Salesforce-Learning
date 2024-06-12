public class DocumentUploaderController {
    @AuraEnabled
    public static void uploadDocument(String base64Data, String filename) {
        try {
            Document doc = new Document();
            doc.Name = filename;
            doc.FolderId = UserInfo.getUserId(); 
            doc.Body = EncodingUtil.base64Decode(base64Data);
            doc.ContentType = 'application/octet-stream';
            doc.IsPublic = false;
            insert doc;

        } catch (Exception e) {
            throw new AuraHandledException('Error uploading document: ' + e.getMessage());
        }
    }
}
