@RestResource(urlMapping = '/accountapi/')
global class AccountApi {
    @httpGet
    global static List<Account> getAccounts(){
        List<Account> accList = [SELECT Id, name, annualRevenue FROM
                                Account WHERE annualRevenue != Null
                                ORDER BY annualRevenue DESC Limit 5];
        return accList;
    }

}