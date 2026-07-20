# Miscellaneous Must-Know Programs

## 1. Singleton (thread-safe, lazy)

```java
public class Singleton {
    private Singleton() {                       // private: nobody else constructs it
        System.out.println("instance created");
    }

    private static class Holder {               // loaded lazily, thread-safe by JVM spec
        static final Singleton INSTANCE = new Singleton();
    }

    public static Singleton getInstance() { return Holder.INSTANCE; }

    public static void main(String[] args) {
        System.out.println("before first use");
        Singleton a = Singleton.getInstance();
        Singleton b = Singleton.getInstance();
        System.out.println("same object? " + (a == b));
    }
}
```

**Output:**

```
before first use
instance created
same object? true
```

The *initialization-on-demand holder* idiom: lazy, thread-safe, no locking code.
(An `enum` singleton is the other canonical answer.)

## 2. Leap year

```java
public class LeapYear {
    static boolean isLeap(int y) {
        return (y % 4 == 0 && y % 100 != 0) || y % 400 == 0;
    }
    public static void main(String[] args) {
        System.out.println("2024: " + isLeap(2024));
        System.out.println("1900: " + isLeap(1900));   // divisible by 100, not 400
        System.out.println("2000: " + isLeap(2000));
    }
}
```

**Output:**

```
2024: true
1900: false
2000: true
```

## 3. Binary search (iterative)

```java
public class BinarySearch {
    static int search(int[] a, int target) {
        int lo = 0, hi = a.length - 1;
        while (lo <= hi) {
            int mid = lo + (hi - lo) / 2;       // avoids (lo+hi) overflow
            if (a[mid] == target) return mid;
            if (a[mid] < target) lo = mid + 1;
            else hi = mid - 1;
        }
        return -1;
    }
    public static void main(String[] args) {
        int[] sorted = {2, 5, 8, 12, 16, 23, 38};
        System.out.println("index of 16: " + search(sorted, 16));
        System.out.println("index of 7 : " + search(sorted, 7));
    }
}
```

**Output:**

```
index of 16: 4
index of 7 : -1
```

## 4. Bubble sort (know one simple sort cold)

```java
import java.util.Arrays;

public class BubbleSort {
    public static void main(String[] args) {
        int[] a = {5, 1, 4, 2, 8};
        for (int pass = 0; pass < a.length - 1; pass++) {
            boolean swapped = false;
            for (int i = 0; i < a.length - 1 - pass; i++) {
                if (a[i] > a[i + 1]) {
                    int t = a[i]; a[i] = a[i + 1]; a[i + 1] = t;
                    swapped = true;
                }
            }
            System.out.println("after pass " + (pass + 1) + ": " + Arrays.toString(a));
            if (!swapped) break;               // already sorted — early exit
        }
    }
}
```

**Output:**

```
after pass 1: [1, 4, 2, 5, 8]
after pass 2: [1, 2, 4, 5, 8]
after pass 3: [1, 2, 4, 5, 8]
```

## 5. Matrix transpose

```java
import java.util.Arrays;

public class Transpose {
    public static void main(String[] args) {
        int[][] m = {{1, 2, 3}, {4, 5, 6}};
        int[][] t = new int[m[0].length][m.length];
        for (int r = 0; r < m.length; r++)
            for (int c = 0; c < m[0].length; c++)
                t[c][r] = m[r][c];
        System.out.println(Arrays.deepToString(t));
    }
}
```

**Output:**

```
[[1, 4], [2, 5], [3, 6]]
```

## 6. Count vowels & consonants

```java
public class VowelCount {
    public static void main(String[] args) {
        String s = "Java Concept Of The Day";
        int vowels = 0, consonants = 0;
        for (char c : s.toLowerCase().toCharArray()) {
            if (c < 'a' || c > 'z') continue;
            if ("aeiou".indexOf(c) >= 0) vowels++;
            else consonants++;
        }
        System.out.println("vowels=" + vowels + " consonants=" + consonants);
    }
}
```

**Output:**

```
vowels=7 consonants=12
```

## 7. Power without Math.pow (fast exponentiation)

```java
public class FastPower {
    static long pow(long base, int exp) {
        long result = 1;
        while (exp > 0) {
            if ((exp & 1) == 1) result *= base;   // odd exponent → take one factor
            base *= base;                          // square
            exp >>= 1;                             // halve
        }
        return result;
    }
    public static void main(String[] args) {
        System.out.println("3^10 = " + pow(3, 10));
        System.out.println("2^20 = " + pow(2, 20));
    }
}
```

**Output:**

```
3^10 = 59049
2^20 = 1048576
```

O(log n) multiplications instead of n — a favourite follow-up question.

## 8. FizzBuzz (yes, it still gets asked)

```java
public class FizzBuzz {
    public static void main(String[] args) {
        for (int i = 1; i <= 15; i++) {
            String out = (i % 15 == 0) ? "FizzBuzz"
                       : (i % 3 == 0)  ? "Fizz"
                       : (i % 5 == 0)  ? "Buzz"
                       : String.valueOf(i);
            System.out.print(out + " ");
        }
        System.out.println();
    }
}
```

**Output:**

```
1 2 Fizz 4 Buzz Fizz 7 8 Fizz Buzz 11 Fizz 13 14 FizzBuzz 
```

> 💡 Interviewers care less about *the* answer and more about: edge cases first
> (`n=0`, negatives, empty), overflow awareness, and being able to state the
> time/space complexity of what you wrote.
