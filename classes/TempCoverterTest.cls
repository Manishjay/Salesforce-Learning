@isTest
public class TempCoverterTest {
    @isTest
    static void testWarm(){
        Decimal cel = TempConverter.fahrenheitToCel(70);
        System.assertEquals(21.11, cel);
    }

}