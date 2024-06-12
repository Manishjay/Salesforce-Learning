public class FlightsController {

    @AuraEnabled(cacheable=true)
    public static List<Flight__c> getFlights() {
        try {
            return [SELECT Id, Name, Origin__c, Destination__c, Departure_Date__c, Return_Date__c, Price__c, Cabin_Class__c, Trip_Type__c, Direct_Flights__c, Adults__c FROM Flight__c];
        } catch (Exception e) {
            throw new AuraHandledException('Error while fetching flight data');
        }
    }
    
    @AuraEnabled
    public static List<Flight__c> searchFlights(String origin, String destination, Date departureDate, Date returnDate, List<String> cabinClasses, Boolean directFlights, Integer adults, String tripType, Decimal maxPrice) {
        try {
            String queryString = 'SELECT Id, Name, Origin__c, Destination__c, Departure_Date__c, Return_Date__c, Price__c, Cabin_Class__c, Trip_Type__c, Direct_Flights__c, Adults__c FROM Flight__c WHERE Price__c <= :maxPrice';
            
            if (String.isNotBlank(origin)) {
                queryString += ' AND Origin__c LIKE \'%' + origin + '%\'';
            }
            if (String.isNotBlank(destination)) {
                queryString += ' AND Destination__c LIKE \'%' + destination + '%\'';
            }
            if (departureDate != null) {
                queryString += ' AND Departure_Date__c = :departureDate';
            }
            if (returnDate != null) {
                queryString += ' AND Return_Date__c = :returnDate';
            }
            if (!cabinClasses.isEmpty()) {
                queryString += ' AND Cabin_Class__c IN :cabinClasses';
            }
            if (directFlights != null) {
                queryString += ' AND Direct_Flights__c = :directFlights';
            }
            if (adults != null) {
                queryString += ' AND Adults__c = :adults';
            }
            if (String.isNotBlank(tripType)) {
                queryString += ' AND Trip_Type__c = :tripType';
            }

            return Database.query(queryString);
        } catch (Exception e) {
            throw new AuraHandledException('Error while fetching flight data');
        }
    }
}
