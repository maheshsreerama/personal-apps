# Control Flow — if, switch & Loops

## if / else if / else

```java
public class GradeDemo {
    public static void main(String[] args) {
        int marks = 78;
        if (marks >= 90) {
            System.out.println("Grade A");
        } else if (marks >= 70) {
            System.out.println("Grade B");
        } else if (marks >= 50) {
            System.out.println("Grade C");
        } else {
            System.out.println("Fail");
        }
    }
}
```

**Output:**

```
Grade B
```

## switch — classic and modern

The classic `switch` **falls through** unless you `break`:

```java
public class SwitchDemo {
    public static void main(String[] args) {
        int day = 3;
        switch (day) {
            case 1: System.out.println("Mon"); break;
            case 2: System.out.println("Tue"); break;
            case 3: System.out.println("Wed"); // no break — falls through!
            case 4: System.out.println("Thu"); break;
            default: System.out.println("Other");
        }
    }
}
```

**Output:**

```
Wed
Thu
```

Java 14+ **switch expressions** use arrows, never fall through, and can return a value:

```java
public class SwitchExprDemo {
    public static void main(String[] args) {
        int day = 6;
        String type = switch (day) {
            case 1, 2, 3, 4, 5 -> "Weekday";
            case 6, 7          -> "Weekend";
            default            -> "Invalid";
        };
        System.out.println(type);
    }
}
```

**Output:**

```
Weekend
```

## The three loops

```java
public class LoopsDemo {
    public static void main(String[] args) {
        for (int i = 1; i <= 3; i++)          // known iteration count
            System.out.println("for: " + i);

        int n = 3;
        while (n > 0) {                        // check condition first
            System.out.println("while: " + n);
            n--;
        }

        int m = 0;
        do {                                   // body runs at least once
            System.out.println("do-while runs even though m = " + m);
        } while (m > 0);
    }
}
```

**Output:**

```
for: 1
for: 2
for: 3
while: 3
while: 2
while: 1
do-while runs even though m = 0
```

## Enhanced for (for-each)

```java
public class ForEachDemo {
    public static void main(String[] args) {
        String[] langs = {"Java", "Kotlin", "Scala"};
        for (String lang : langs) {
            System.out.println(lang);
        }
    }
}
```

**Output:**

```
Java
Kotlin
Scala
```

## break, continue & labels

```java
public class BreakContinueDemo {
    public static void main(String[] args) {
        for (int i = 1; i <= 5; i++) {
            if (i == 3) continue;   // skip 3
            if (i == 5) break;      // stop before 5
            System.out.println(i);
        }

        outer:                       // label: break out of BOTH loops
        for (int i = 1; i <= 3; i++) {
            for (int j = 1; j <= 3; j++) {
                if (i * j == 4) break outer;
                System.out.println(i + " x " + j + " = " + (i * j));
            }
        }
    }
}
```

**Output:**

```
1
2
4
1 x 1 = 1
1 x 2 = 2
1 x 3 = 3
2 x 1 = 2
```

> 💡 **Rule of thumb:** use `for` when the count is known, `while` when it isn't, and
> `do-while` when the body must run at least once (e.g. menu loops).
