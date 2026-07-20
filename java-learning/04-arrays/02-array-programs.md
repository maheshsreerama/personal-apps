# Classic Array Programs

## 1. Largest & smallest element

```java
public class MinMax {
    public static void main(String[] args) {
        int[] a = {14, 3, 27, 8, 51, 6};
        int min = a[0], max = a[0];
        for (int v : a) {
            if (v < min) min = v;
            if (v > max) max = v;
        }
        System.out.println("min = " + min + ", max = " + max);
    }
}
```

**Output:**

```
min = 3, max = 51
```

## 2. Second largest (one pass, no sorting)

```java
public class SecondLargest {
    public static void main(String[] args) {
        int[] a = {12, 35, 1, 10, 34, 1};
        int first = Integer.MIN_VALUE, second = Integer.MIN_VALUE;
        for (int v : a) {
            if (v > first)       { second = first; first = v; }
            else if (v > second && v != first) { second = v; }
        }
        System.out.println("largest = " + first + ", second = " + second);
    }
}
```

**Output:**

```
largest = 35, second = 34
```

## 3. Reverse an array in place

```java
import java.util.Arrays;

public class ReverseArray {
    public static void main(String[] args) {
        int[] a = {1, 2, 3, 4, 5};
        for (int i = 0, j = a.length - 1; i < j; i++, j--) {
            int t = a[i]; a[i] = a[j]; a[j] = t;
        }
        System.out.println(Arrays.toString(a));
    }
}
```

**Output:**

```
[5, 4, 3, 2, 1]
```

## 4. Sum & average

```java
public class SumAvg {
    public static void main(String[] args) {
        int[] a = {10, 20, 30, 40};
        int sum = 0;
        for (int v : a) sum += v;
        System.out.println("sum = " + sum + ", avg = " + (double) sum / a.length);
    }
}
```

**Output:**

```
sum = 100, avg = 25.0
```

## 5. Find duplicates

```java
import java.util.HashSet;
import java.util.Set;

public class FindDuplicates {
    public static void main(String[] args) {
        int[] a = {4, 2, 7, 4, 9, 2, 2};
        Set<Integer> seen = new HashSet<>();
        Set<Integer> dups = new HashSet<>();
        for (int v : a) {
            if (!seen.add(v)) dups.add(v);   // add() returns false if already present
        }
        System.out.println("duplicates: " + dups);
    }
}
```

**Output:**

```
duplicates: [2, 4]
```

## 6. Missing number from 1..n

Uses the sum formula `n(n+1)/2` — O(n) time, O(1) space:

```java
public class MissingNumber {
    public static void main(String[] args) {
        int[] a = {1, 2, 4, 5, 6};    // n = 6, one number missing
        int n = 6;
        int expected = n * (n + 1) / 2;
        int actual = 0;
        for (int v : a) actual += v;
        System.out.println("missing = " + (expected - actual));
    }
}
```

**Output:**

```
missing = 3
```

## 7. Merge two sorted arrays

```java
import java.util.Arrays;

public class MergeSorted {
    public static void main(String[] args) {
        int[] x = {1, 4, 7};
        int[] y = {2, 3, 9};
        int[] out = new int[x.length + y.length];
        int i = 0, j = 0, k = 0;
        while (i < x.length && j < y.length)
            out[k++] = (x[i] <= y[j]) ? x[i++] : y[j++];
        while (i < x.length) out[k++] = x[i++];
        while (j < y.length) out[k++] = y[j++];
        System.out.println(Arrays.toString(out));
    }
}
```

**Output:**

```
[1, 2, 3, 4, 7, 9]
```

## 8. Rotate left by k positions

```java
import java.util.Arrays;

public class RotateArray {
    static void reverse(int[] a, int from, int to) {
        while (from < to) { int t = a[from]; a[from++] = a[to]; a[to--] = t; }
    }
    public static void main(String[] args) {
        int[] a = {1, 2, 3, 4, 5, 6, 7};
        int k = 3;                       // rotate left by 3
        reverse(a, 0, k - 1);            // 3 2 1 | 4 5 6 7
        reverse(a, k, a.length - 1);     // 3 2 1 | 7 6 5 4
        reverse(a, 0, a.length - 1);     // 4 5 6 7 1 2 3
        System.out.println(Arrays.toString(a));
    }
}
```

**Output:**

```
[4, 5, 6, 7, 1, 2, 3]
```

## 9. Pair with a given sum (two pointers)

```java
import java.util.Arrays;

public class PairSum {
    public static void main(String[] args) {
        int[] a = {8, 4, 1, 6, 10, 3};
        int target = 10;
        Arrays.sort(a);                       // 1 3 4 6 8 10
        int lo = 0, hi = a.length - 1;
        while (lo < hi) {
            int sum = a[lo] + a[hi];
            if (sum == target) {
                System.out.println("pair: " + a[lo] + " + " + a[hi]);
                lo++; hi--;
            } else if (sum < target) lo++;
            else hi--;
        }
    }
}
```

**Output:**

```
pair: 4 + 6
```

> 💡 Notice the recurring tricks: **two pointers**, **HashSet for seen-before**, and
> **math formulas** instead of brute force. They cover half of all array interview
> questions.
