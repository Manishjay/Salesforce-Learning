public class SalesOrderController {
    
    @AuraEnabled (cacheable = true)
    public static List<Sale_Order__c> getOrderDetails(){
        return [SELECT Id, Name, Order_Date__c, Order_Number__c, Order_Status__c, Total_Amount__c FROM Sale_Order__c];
    }
    
    @AuraEnabled
    public static Sale_Order__c saveRecords(Sale_Order__c order){
        upsert order;
        return order;
    }
    
    @AuraEnabled
    public static void deleteSalesOrder(Id orderId){
        if(String.isNotBlank(orderId)){
            Sale_Order__c orderToDelete = new Sale_Order__c(Id = orderId);
            delete orderToDelete;
        }
    }    

    // @AuraEnabled (cacheable = true)
    // public static List<AccountWrapper> getAccountsWithContactsAndOpportunities() {
    //     List<AccountWrapper> results = new List<AccountWrapper>();
    //     List<Account> accounts = [
    //         SELECT Id, Name,
    //                (SELECT Id, Name FROM Contacts), 
    //                (SELECT Id, Name FROM Opportunities) 
    //         FROM Account
    //     ];
        
    //     Set<String> uniqueCombinations = new Set<String>();

    //     for (Account acc : accounts) {
    //         for (Contact con : acc.Contacts) {
    //             for (Opportunity opp : acc.Opportunities) {
    //                 String uniqueKey = acc.Id + '-' + con.Id + '-' + opp.Id;
    //                 if (!uniqueCombinations.contains(uniqueKey)) {
    //                     AccountWrapper wrap = new AccountWrapper();
    //                     wrap.account = acc;
    //                     wrap.contact = con;
    //                     wrap.opportunity = opp;
    //                     results.add(wrap);
    //                     uniqueCombinations.add(uniqueKey);
    //                 }
    //             }
    //         }
    //     }
        
    //     return results;
    // }

    @AuraEnabled (cacheable = true)
    public static List<OpportunityWrapper> getAccountsWithOpportunitiesAndContacts() {
        List<OpportunityWrapper> results = new List<OpportunityWrapper>();

        List<Account> accounts = [
            SELECT Id, Name,
                   (SELECT Id, Name FROM Opportunities),
                   (SELECT Id, Name FROM Contacts LIMIT 1)
            FROM Account
        ];

        for (Account acc : accounts) {
            for (Opportunity opp : acc.Opportunities) {
                OpportunityWrapper wrap = new OpportunityWrapper();
                wrap.account = acc;
                wrap.opportunity = opp;
                if (!acc.Contacts.isEmpty()) {
                    wrap.contact = acc.Contacts[0];
                }
                results.add(wrap);
            }
        }

        return results;
    }

        public class OpportunityWrapper {
            @AuraEnabled
            public Opportunity opportunity { get; set; }
            @AuraEnabled
            public Account account { get; set; }
            @AuraEnabled
            public Contact contact { get; set; }
        }    
    
}