public with sharing class Form01Controller {
    @AuraEnabled
    public static string methodName(){
        try {
            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    public static void recordInsertion(Contact contact) {
        try {
            insert contact;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}


