package farm.vila;

import java.util.Random;

public class Utils {

  // Generates a random int with n digits
  public static int generateRandomDigits(int n) {
    int m = (int) Math.pow(10, n - 1);
    return m + new Random().nextInt(9 * m);
  }

}
