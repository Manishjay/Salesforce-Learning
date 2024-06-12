//apex class to insert contacts using lwc !

public with sharing class CreateMultipleContactsController {
    @AuraEnabled
    public static ResponseWrapper saveMultipleContacts(List<contact> contacts){
        ResponseWrapper response = new ResponseWrapper();
        try {
            insert contacts;
            response.isSuccess = true;
            
        } catch (Exception e) {
            response.isSuccess = false;
            response.message = e.getMessage();
        }
        return response;
    }

    // wrapper class
    public class ResponseWrapper{
        @AuraEnabled
        public boolean isSuccess{get; set;}
        @AuraEnabled
        public String message{get; set;}
    }
}