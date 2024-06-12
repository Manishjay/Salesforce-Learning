public with sharing class EmployeeController {
    
    @AuraEnabled(cacheable=true)
    public static List<EmpDir__c> getEmployees() {
        return [SELECT Id, Name, Email__c, Department__c, Position__c, Date_of_Birth__c, Phone__c FROM EmpDir__c];
    }
    
    @AuraEnabled
    public static void createEmployee(String name, String email, String department, String position, Date dob, String phone) {
        EmpDir__c emp = new EmpDir__c(Name=name, Email__c=email, Department__c=department, Position__c=position, Date_of_Birth__c=dob, Phone__c=phone);
        insert emp;
    }
    
    @AuraEnabled
    public static void updateEmployee(String empId, String name, String email, String department, String position, Date dob, String phone) {
        EmpDir__c emp = [SELECT Id FROM EmpDir__c WHERE Id = :empId LIMIT 1];
        if (emp != null) {
            emp.Name = name;
            emp.Email__c = email;
            emp.Department__c = department;
            emp.Position__c = position;
            emp.Date_of_Birth__c = dob;
            emp.Phone__c = phone;
            update emp;
        }
    }
    
    @AuraEnabled
    public static void deleteEmployee(String empId) {
        EmpDir__c emp = [SELECT Id FROM EmpDir__c WHERE Id = :empId LIMIT 1];
        if (emp != null) {
            delete emp;
        }
    }
}
