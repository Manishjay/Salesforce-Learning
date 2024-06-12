public class propertyController {
    
        // For fetching all the fields using wire decorators!
        @AuraEnabled(cacheable=true)
        public static List<Property__c> getPropertyItems() {
            try {
                return [SELECT Id, Name, Description__c, Price__c, Image__c, PropertyType__c FROM Property__c];
            } catch (Exception e) {
                System.debug('Error while fetching properties: ' + e.getMessage());
                throw new AuraHandledException('Error while fetching properties!');
            }
        }
        
        // For Dynamic searching !
        @AuraEnabled
        public static List<Property__c> searchPropertyItems(String searchKeywords, List<String> filters) {
            try {
                String searchTerm = '%' + searchKeywords + '%';
                String queryString = 'SELECT Id, Name, Description__c, Price__c, Image__c, PropertyType__c FROM Property__c WHERE (Name LIKE :searchTerm OR Description__c LIKE :searchTerm)';
                if (filters != null && !filters.isEmpty()) {
                    queryString += ' AND PropertyType__c IN :filters';
                }
                return Database.query(queryString);
            } catch (Exception e) {
                System.debug('Error while searching properties: ' + e.getMessage());
                throw new AuraHandledException('Error while searching properties!');
            }
        }
     
        // For Delete functionality!
        @AuraEnabled
        public static void deleteProperty(Id propertyId) {
            try {
                Property__c property = [SELECT Id FROM Property__c WHERE Id = :propertyId LIMIT 1];
                delete property;
            } catch (Exception e) {
                System.debug('Error while deleting property: ' + e.getMessage());
                throw new AuraHandledException('Error while deleting property!');
            }
        }
}

    
