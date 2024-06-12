public class FoodController {

    // Fetching data from 
    @AuraEnabled(cacheable=true)
    public static List<FoodMenu__c> getFoodItems() {
        try {
            return [SELECT Id, Name, Description__c, Price__c, Image__c, Categories__c, Ratings__c, Rating_Stars__c	 FROM FoodMenu__c];
        } catch (Exception e) {
            throw new AuraHandledException('Error while fetching!');
        }
    }
    
    // Dynamic SOQL to fetch data at runtime!
    @AuraEnabled
    public static List<FoodMenu__c> searchFoodItems(String searchKeywords, List<String> categories, Integer maxPrice) {
        try {
            if (categories.isEmpty()) {
                categories = new List<String>{'Veg', 'Non-Veg'};
            }
            String queryString = 'SELECT Id, Name, Description__c, Price__c, Image__c, Categories__c FROM FoodMenu__c ';
            queryString += 'WHERE Price__c <= :maxPrice AND Name LIKE \'%' + searchKeywords + '%\' AND Categories__c IN :categories';
    
            return Database.query(queryString);
        } catch (Exception e) {
            throw new AuraHandledException('Error while fetching!');
        }
    }

    // For Record Deletion!
    @AuraEnabled
    public static void deleteFoodItem(Id foodItemId) {
        try {
            if (String.isNotBlank(foodItemId)) {
                FoodMenu__c foodItemToDelete = new FoodMenu__c(Id = foodItemId);
                delete foodItemToDelete;
            }
        } catch (DmlException e) {
            throw new AuraHandledException('Error deleting food item: ' + e.getMessage());
        }
    }
}