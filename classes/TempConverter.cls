public class TempConverter {
    
    public static Decimal fahrenheitToCel(Decimal fh){
        Decimal cel = (fh - 32) * 5/9;
        return cel.setScale(2);
    }
}