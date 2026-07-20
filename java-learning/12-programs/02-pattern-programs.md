# Pattern Printing Programs

Pattern questions test loop control. The universal recipe: **outer loop = rows, inner
loop(s) = what each row contains**. Work out the count of spaces/stars per row on paper
first.

## 1. Right triangle

```java
public class RightTriangle {
    public static void main(String[] args) {
        int n = 5;
        for (int row = 1; row <= n; row++) {
            for (int col = 1; col <= row; col++) System.out.print("*");
            System.out.println();
        }
    }
}
```

**Output:**

```
*
**
***
****
*****
```

## 2. Inverted triangle

```java
public class InvertedTriangle {
    public static void main(String[] args) {
        int n = 5;
        for (int row = n; row >= 1; row--) {
            System.out.println("*".repeat(row));
        }
    }
}
```

**Output:**

```
*****
****
***
**
*
```

## 3. Pyramid

Each row `r` (1-based) has `n-r` spaces then `2r-1` stars:

```java
public class Pyramid {
    public static void main(String[] args) {
        int n = 5;
        for (int r = 1; r <= n; r++) {
            System.out.println(" ".repeat(n - r) + "*".repeat(2 * r - 1));
        }
    }
}
```

**Output:**

```
    *
   ***
  *****
 *******
*********
```

## 4. Diamond

Pyramid + inverted pyramid, sharing the widest row:

```java
public class Diamond {
    public static void main(String[] args) {
        int n = 4;
        for (int r = 1; r <= n; r++)
            System.out.println(" ".repeat(n - r) + "*".repeat(2 * r - 1));
        for (int r = n - 1; r >= 1; r--)
            System.out.println(" ".repeat(n - r) + "*".repeat(2 * r - 1));
    }
}
```

**Output:**

```
   *
  ***
 *****
*******
 *****
  ***
   *
```

## 5. Hollow square

Print `*` only on the border — first/last row or first/last column:

```java
public class HollowSquare {
    public static void main(String[] args) {
        int n = 5;
        for (int r = 1; r <= n; r++) {
            StringBuilder line = new StringBuilder();
            for (int c = 1; c <= n; c++) {
                boolean border = r == 1 || r == n || c == 1 || c == n;
                line.append(border ? '*' : ' ');
            }
            System.out.println(line);
        }
    }
}
```

**Output:**

```
*****
*   *
*   *
*   *
*****
```

## 6. Number triangle

```java
public class NumberTriangle {
    public static void main(String[] args) {
        for (int r = 1; r <= 5; r++) {
            for (int c = 1; c <= r; c++) System.out.print(c);
            System.out.println();
        }
    }
}
```

**Output:**

```
1
12
123
1234
12345
```

## 7. Floyd's triangle (continuous numbering)

```java
public class Floyds {
    public static void main(String[] args) {
        int value = 1;
        for (int r = 1; r <= 4; r++) {
            for (int c = 1; c <= r; c++) System.out.print(value++ + " ");
            System.out.println();
        }
    }
}
```

**Output:**

```
1 
2 3 
4 5 6 
7 8 9 10 
```

## 8. Pascal's triangle

Each entry is a binomial coefficient; build it row by row:

```java
public class Pascal {
    public static void main(String[] args) {
        int n = 5;
        for (int r = 0; r < n; r++) {
            System.out.print(" ".repeat(n - r - 1));
            int value = 1;                          // C(r, 0)
            for (int c = 0; c <= r; c++) {
                System.out.print(value + " ");
                value = value * (r - c) / (c + 1);  // C(r, c+1) from C(r, c)
            }
            System.out.println();
        }
    }
}
```

**Output:**

```
    1 
   1 1 
  1 2 1 
 1 3 3 1 
1 4 6 4 1 
```

## 9. Character pattern

```java
public class CharPattern {
    public static void main(String[] args) {
        for (char last = 'A'; last <= 'E'; last++) {
            for (char c = 'A'; c <= last; c++) System.out.print(c);
            System.out.println();
        }
    }
}
```

**Output:**

```
A
AB
ABC
ABCD
ABCDE
```

> 💡 When stuck on any pattern: make a table of `row → (spaces, symbols)` for n = 4,
> spot the arithmetic (usually `n-r` and `2r-1` or `r`), then translate to loops.
