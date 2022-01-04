package springs.network;

public class Main {

    public static void main(String[] args) throws Exception {

        System.out.println("WebApplication version 1.0.00.12");

        String dir = System.getProperty("user.dir");
        System.out.println("working folder : " + dir);

        Example.start();

    }

}
