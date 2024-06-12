public class AccountTriggerHandler {
    
    public static void handleBeforeInsert(List<Account> accList){
        for(Account ac : accList){
            if(String.isBlank(ac.Type)){
                ac.Type = 'Prospect';
            }
            System.debug('Testing Evluated!');
            
           ac.Description = (ac.Description != null ? ac.Description + '\n' : 'Testing...');
        }
    }

}