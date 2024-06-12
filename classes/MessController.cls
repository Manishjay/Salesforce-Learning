public class MessController {
   
        @AuraEnabled
        public static Customer__c getRecordById(Id recordId) {
            if (recordId == null) {
                return new Customer__c();
            }
            return [SELECT Id, Name, Order_Date__c, Amount__c FROM Customer__c WHERE Id = :recordId LIMIT 1];
        }
    
        @AuraEnabled
        public static void saveRecord(Customer__c customObj) {
            // if (customObj.Id == null) {
            //     insert customObj;
            // } else {
            //     update customObj;
            // }
            upsert customObj
        }
}