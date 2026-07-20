# Essential String Methods

One runnable tour of the methods you'll use daily:

```java
public class StringMethods {
    public static void main(String[] args) {
        String s = "  Java Concept of the Day  ";

        // cleaning & case
        System.out.println("[" + s.trim() + "]");
        System.out.println(s.strip().toUpperCase());
        System.out.println(s.strip().toLowerCase());

        String t = s.strip();

        // inspecting
        System.out.println("length      : " + t.length());
        System.out.println("charAt(5)   : " + t.charAt(5));
        System.out.println("indexOf     : " + t.indexOf("Concept"));
        System.out.println("contains    : " + t.contains("Day"));
        System.out.println("startsWith  : " + t.startsWith("Java"));
        System.out.println("endsWith    : " + t.endsWith("Day"));
        System.out.println("isEmpty     : " + t.isEmpty());
        System.out.println("isBlank     : " + "   ".isBlank());
    }
}
```

**Output:**

```
[Java Concept of the Day]
JAVA CONCEPT OF THE DAY
java concept of the day
length      : 23
charAt(5)   : C
indexOf     : 5
contains    : true
startsWith  : true
endsWith    : true
isEmpty     : false
isBlank     : true
```

## Extracting & transforming

```java
public class StringTransform {
    public static void main(String[] args) {
        String t = "Java Concept of the Day";

        System.out.println(t.substring(5));        // from index 5 to end
        System.out.println(t.substring(5, 12));    // [5, 12) — end exclusive
        System.out.println(t.replace("Day", "Week"));
        System.out.println(t.repeat(2));
        System.out.println("a-b-c".split("-").length + " parts");
        System.out.println(String.join(" | ", "red", "green", "blue"));
        System.out.println(String.valueOf(3.14) + " (now a String)");
        System.out.println("42".concat("!"));
    }
}
```

**Output:**

```
Concept of the Day
Concept
Java Concept of the Week
Java Concept of the DayJava Concept of the Day
3 parts
red | green | blue
3.14 (now a String)
42!
```

`substring(begin, end)` includes `begin`, **excludes** `end` — the length of the result is
always `end - begin`.

## String ↔ number conversions

```java
public class ConvertDemo {
    public static void main(String[] args) {
        int n = Integer.parseInt("123");          // String → int
        double d = Double.parseDouble("2.5");     // String → double
        String s1 = String.valueOf(456);          // number → String
        String s2 = 789 + "";                     // quick & dirty

        System.out.println(n + 1);
        System.out.println(d * 2);
        System.out.println(s1 + "0");             // string concat, not math!
        System.out.println(s2.length());
    }
}
```

**Output:**

```
124
5.0
4560
3
```

`Integer.parseInt("12a")` throws `NumberFormatException` — validate or catch it.

## Formatting output

```java
public class FormatDemo {
    public static void main(String[] args) {
        String name = "Asha";
        double score = 91.4567;

        System.out.printf("%s scored %.2f%%%n", name, score);
        System.out.println(String.format("|%10s|", "right"));   // pad left
        System.out.println(String.format("|%-10s|", "left"));   // pad right
        System.out.println(String.format("%,d", 12345678));     // thousands
        System.out.println("Id: %05d".formatted(42));           // zero-pad
    }
}
```

**Output:**

```
Asha scored 91.46%
|     right|
|left      |
12,345,678
Id: 00042
```

| Specifier | Meaning |
|-----------|---------|
| `%s` | string |
| `%d` | integer |
| `%.2f` | float, 2 decimals |
| `%n` | newline |
| `%%` | literal % |

## chars() and toCharArray()

```java
public class CharsDemo {
    public static void main(String[] args) {
        for (char c : "abc".toCharArray()) System.out.print(c + " ");
        System.out.println();
        System.out.println("hello".chars().distinct().count() + " distinct chars");
    }
}
```

**Output:**

```
a b c
4 distinct chars
```
