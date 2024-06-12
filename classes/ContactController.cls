public with sharing class ContactController {
    
    // Fetches the fields of contact object!
    @AuraEnabled (cacheable=true)
    public static List<Contact> getContacts() {
        return [SELECT Id, FirstName, LastName, Email FROM Contact LIMIT 100];
    }

    // For creating contacts!
    // @AuraEnabled
    // public static Contact createContact(Contact newContact) {
    //     insert newContact;
    //     return newContact;
    // }

    // For Updating contacts!
    // @AuraEnabled
    // public static Contact updateContact(Contact updatedContact) {
    //     update updatedContact;
    //     return updatedContact;
    // }

    @AuraEnabled
    public static Contact upsertContact(Contact contact) {
        upsert contact;
        return contact;
    }

    // For Deleting Contacts!
    @AuraEnabled
    public static void deleteContact(Id contactId) {
        delete [SELECT Id FROM Contact WHERE Id = :contactId];
    }
}
