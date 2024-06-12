public class Rectangle {
    
    public void area(){
        Decimal length = 44, breadth = 4;
        Decimal area = length * breadth;
        System.debug('Area Of Rectangle: ' + area);
    }
    
    public void perimeter(){
         Decimal length = 44, breadth = 4;
        Decimal peri = 2 * (length + breadth);
        System.debug('Perimeter Of Rectangle: ' + peri);
    }
}