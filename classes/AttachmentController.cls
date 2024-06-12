public class AttachmentController {
    @AuraEnabled
    public static void uploadAttachment(String base64Data, String fileName, Id recordId) {
        try {
            Attachment attachment = new Attachment();
            attachment.Name = fileName;
            attachment.Body = EncodingUtil.base64Decode(base64Data);
            attachment.ContentType = 'application/octet-stream';
            attachment.ParentId = recordId;

            insert attachment;
        } catch (Exception e) {
            throw new AuraHandledException('Error uploading attachment: ' + e.getMessage());
        }
    }
}