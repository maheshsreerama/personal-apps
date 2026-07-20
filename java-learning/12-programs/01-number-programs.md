# Number Programs — The Interview Classics

## 1. Fibonacci series

```java
public class Fibonacci {
    public static void main(String[] args) {
        int n = 10;
        long a = 0, b = 1;
        StringBuilder out = new StringBuilder();
        for (int i = 0; i < n; i++) {
            out.append(a).append(' ');
            long next = a + b;
            a = b;
            b = next;
        }
        System.out.println(out.toString().trim());
    }
}
```

**Output:**

```
0 1 1 2 3 5 8 13 21 34
```

## 2. Prime check + primes up to N

```java
public class Primes {
    static boolean isPrime(int n) {
        if (n < 2) return false;
        for (int i = 2; (long) i * i <= n; i++) {   // only up to √n
            if (n % i == 0) return false;
        }
        return true;
    }
    public static void main(String[] args) {
        System.out.println("29 prime? " + isPrime(29));
        System.out.println("91 prime? " + isPrime(91));   // 7 × 13

        StringBuilder out = new StringBuilder();
        for (int i = 2; i <= 30; i++) if (isPrime(i)) out.append(i).append(' ');
        System.out.println("primes ≤ 30: " + out.toString().trim());
    }
}
```

**Output:**

```
29 prime? true
91 prime? false
primes ≤ 30: 2 3 5 7 11 13 17 19 23 29
```

## 3. Factorial (loop + recursion)

```java
import java.math.BigInteger;

public class Factorial {
    static long iterative(int n) {
        long f = 1;
        for (int i = 2; i <= n; i++) f *= i;
        return f;
    }
    public static void main(String[] args) {
        System.out.println("6!  = " + iterative(6));

        // beyond 20!, long overflows — use BigInteger
        BigInteger big = BigInteger.ONE;
        for (int i = 2; i <= 25; i++) big = big.multiply(BigInteger.valueOf(i));
        System.out.println("25! = " + big);
    }
}
```

**Output:**

```
6!  = 720
25! = 15511210043330985984000000
```

## 4. Palindrome number (no strings!)

```java
public class PalindromeNumber {
    static boolean isPalindrome(int n) {
        if (n < 0) return false;
        int original = n, reversed = 0;
        while (n > 0) {
            reversed = reversed * 10 + n % 10;   // pull off last digit
            n /= 10;
        }
        return original == reversed;
    }
    public static void main(String[] args) {
        System.out.println(isPalindrome(12321));
        System.out.println(isPalindrome(1231));
    }
}
```

**Output:**

```
true
false
```

## 5. Armstrong number

An n-digit number equal to the sum of its digits each raised to the n-th power
(153 = 1³+5³+3³):

```java
public class Armstrong {
    static boolean isArmstrong(int n) {
        int digits = String.valueOf(n).length();
        int sum = 0, t = n;
        while (t > 0) {
            sum += (int) Math.pow(t % 10, digits);
            t /= 10;
        }
        return sum == n;
    }
    public static void main(String[] args) {
        for (int i = 100; i <= 1000; i++)
            if (isArmstrong(i)) System.out.print(i + " ");
        System.out.println();
    }
}
```

**Output:**

```
153 370 371 407 
```

## 6. Swap two numbers without a temp variable

```java
public class Swap {
    public static void main(String[] args) {
        int a = 5, b = 9;

        // arithmetic way
        a = a + b;    // 14
        b = a - b;    // 5
        a = a - b;    // 9
        System.out.println("arithmetic: a=" + a + " b=" + b);

        // XOR way
        a ^= b; b ^= a; a ^= b;
        System.out.println("xor swap  : a=" + a + " b=" + b);
    }
}
```

**Output:**

```
arithmetic: a=9 b=5
xor swap  : a=5 b=9
```

## 7. GCD & LCM (Euclid's algorithm)

```java
public class GcdLcm {
    static int gcd(int a, int b) {
        while (b != 0) { int t = b; b = a % b; a = t; }
        return a;
    }
    public static void main(String[] args) {
        int a = 24, b = 36;
        int g = gcd(a, b);
        System.out.println("gcd = " + g);
        System.out.println("lcm = " + (a / g * b));   // divide first: avoids overflow
    }
}
```

**Output:**

```
gcd = 12
lcm = 72
```

## 8. Sum of digits & reverse a number

```java
public class DigitPlay {
    public static void main(String[] args) {
        int n = 9435, sum = 0, rev = 0;
        for (int t = n; t > 0; t /= 10) {
            int digit = t % 10;
            sum += digit;
            rev = rev * 10 + digit;
        }
        System.out.println("digits of " + n + " sum to " + sum);
        System.out.println("reversed: " + rev);
    }
}
```

**Output:**

```
digits of 9435 sum to 21
reversed: 5349
```

## 9. Power of two check (bit trick)

```java
public class PowerOfTwo {
    static boolean isPowerOfTwo(int n) {
        return n > 0 && (n & (n - 1)) == 0;   // powers of 2 have exactly one set bit
    }
    public static void main(String[] args) {
        System.out.println(isPowerOfTwo(64));
        System.out.println(isPowerOfTwo(48));
    }
}
```

**Output:**

```
true
false
```

> 💡 The recurring toolkit: **`% 10` / `/ 10`** to walk digits, **√n bound** for
> divisor checks, **BigInteger** when `long` isn't enough, and **bit tricks** for
> power-of-two style questions.
