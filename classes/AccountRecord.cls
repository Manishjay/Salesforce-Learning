public class AccountRecord {
    public static ID insertAccount(String name, String rating){
        Account ac = new Account();
        ac.Name = name;
        ac.Rating = rating;
        insert ac;		//Insertion of Records on Account Object
        
        return ac.Id;	//After Creation account record, its Id will be available in ac
    }
    
    public static void insertContact(){
        ID accId;
        accId = insertAccount('Manish Singhaniya', 'Excellent');
        Contact con = new Contact(FirstName = 'Contact 111', LastName = 'con 222');
        con.accountId = accId;	//accountId is lookup to account
        insert con;
    }
    
    public static void insertAccountWithConAndOpp(String name, String rating){
        Account ac = new Account();
        ac.Name = name;
        ac.Rating = rating;
        insert ac;		//Insertion of Records on Account Object
        
        Contact con = new Contact(FirstName = 'Contact 111', LastName = 'con 222');
        con.accountId = ac.Id;	//accountId is lookup to account
        insert con;
        
        Opportunity opp = new Opportunity();
        opp.Name = 'Opp 111';
        opp.CloseDate = System.today();
        opp.StageName = 'Prospecting';
        opp.AccountId = ac.Id;
        insert opp;
        
    }
    
}