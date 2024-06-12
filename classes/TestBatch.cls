public class TestBatch implements Database.Batchable<SObject>{
    public Database.QueryLocator start(Database.BatchableContext cn){
        return Databse.getQueryLocator([SELECT Id, Name FROM Account]);
    }

    public static void execute(Database.BatchableContext cn, List<Account> accList){
        for(Account acc : accList){
            acc.Description = 'Batch Processed Successfully!'; 
        }
        update accList;
    }

    public static void finish(Database.BatchableContext cn){
        System.debug('Done Successfully!');
    }
}  