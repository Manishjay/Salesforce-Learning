public class EmailHelper {
    @future
    public static void sendEmail(String subject, String body, List<String> recipients) {
        
        Messaging.SingleEmailMessage email = new Messaging.SingleEmailMessage();
        
        
        email.setSubject(subject);
        email.setPlainTextBody(body);
        email.setToAddresses(recipients);
        
        try {
            
            Messaging.SendEmailResult[] results = Messaging.sendEmail(new Messaging.SingleEmailMessage[]{email});
            
            for (Messaging.SendEmailResult result : results) {
                if (!result.isSuccess()) {
                   
                    System.debug('Failed to send email: ' + result.getErrors()[0].getMessage());
                }
            }
        } catch (Exception e) {
            
            System.debug('Exception while sending email: ' + e.getMessage());
        }
    }
}
