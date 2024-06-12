public class SendEmail implements Database.Batchable<sObject> {
    
    /*public class EmailNotificationSender {

    @future
    public static void sendEmailNotifications(List<Email_Notification__c> emails) {
        List<Messaging.SingleEmailMessage> emailMessages = new List<Messaging.SingleEmailMessage>();

        for (Email_Notification__c email : emails) {
            // Create a new SingleEmailMessage object
            Messaging.SingleEmailMessage emailMessage = new Messaging.SingleEmailMessage();
            emailMessage.setToAddresses(new String[]{email.Email__c});
            emailMessage.setSubject(email.Subject__c);
            emailMessage.setPlainTextBody(email.Body__c);

            // Add the email message to the list
            emailMessages.add(emailMessage);
        }

        // Send the email messages
        Messaging.sendEmail(emailMessages);

        // Update the status of processed records
        for (Email_Notification__c email : emails) {
            email.Status__c = 'Processed';
        }
        update emails;
    }
}*/
    

    public database.querylocator start(database.batchablecontext bx)
    {
        system.debug('i am in start method');
        return Database.getquerylocator([select id,Department from contact]);
    }
    public void execute(database.batchablecontext bxc,list<contact> scope)
    {
        system.debug('current scope is == ' + scope.size());
        list<contact> updatecontactlist = new list<contact>();
        for(contact c: scope)
        {
            if(c.Department == 'salesforce')
            {
                system.debug('i am in if');
                c.department = 'AWS'; 
            }
            else
            {
                system.debug('i am in else');
            }
            updatecontactlist.add(c);
        }
        update updatecontactlist;
    }
    public void finish(database.batchablecontext bxc)
    {
        system.debug('iam in finish method');
        list<string> mailtolist = new list<string> ();
        mailtolist.add('mk.15manish60@gmail.com');
        list<string> ccmailtolist = new list<string> ();
        ccmailtolist.add('manishjay95@gmail.com');
        messaging.singleemailmessage myemail = new messaging.singleemailmessage();
        myemail.settoaddresses(mailtolist);
        myemail.setccaddresses(ccmailtolist);
        myemail.setsubject('batch processing email');
        myemail.setplaintextbody('your records has been updated');
        messaging.sendemail(new messaging.singleemailmessage[] {myemail});
    }
}