public class SearchController {
    @AuraEnabled
    public static List<FoodMenu__c> search(String searchTerm) {
        List<FoodMenu__c> results = [SELECT Id, Name, Description__c FROM FoodMenu__c WHERE Name LIKE :searchTerm];
        return results;
    }
}