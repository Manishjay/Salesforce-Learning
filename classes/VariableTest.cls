public class VariableTest {
    
    public static void testing(){
        /*Account acc = [SELECT Id, Name
                       FROM Account LIMIT 1];
        System.debug(acc);*/
        
        List<Account> accList = new List<Account>();
        accList = [SELECT Id, Name
                  FROM Account Limit 5];
        
        for(INTEGER i = 0; i <= 4; i++){
            System.debug(accList[i]+'\n');
        }
        
    }
    
}