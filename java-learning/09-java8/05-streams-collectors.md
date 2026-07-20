# Streams — Terminal Ops, Collectors & groupingBy

## Terminal operations tour

```java
import java.util.*;
import java.util.stream.*;

public class Terminals {
    public static void main(String[] args) {
        List<Integer> nums = List.of(4, 7, 1, 9, 2);

        System.out.println("count    : " + nums.stream().count());
        System.out.println("max      : " + nums.stream().max(Integer::compare).orElseThrow());
        System.out.println("min      : " + nums.stream().min(Integer::compare).orElseThrow());
        System.out.println("anyMatch : " + nums.stream().anyMatch(n -> n > 8));
        System.out.println("allMatch : " + nums.stream().allMatch(n -> n > 0));
        System.out.println("noneMatch: " + nums.stream().noneMatch(n -> n < 0));
        System.out.println("findFirst: " + nums.stream().filter(n -> n % 2 == 0).findFirst().orElse(-1));

        // reduce: fold everything into one value
        int sum = nums.stream().reduce(0, Integer::sum);
        int product = nums.stream().reduce(1, (a, b) -> a * b);
        System.out.println("sum=" + sum + " product=" + product);

        // numeric streams have stats built in
        IntSummaryStatistics stats = nums.stream().mapToInt(Integer::intValue).summaryStatistics();
        System.out.println("avg=" + stats.getAverage() + " max=" + stats.getMax());
    }
}
```

**Output:**

```
count    : 5
max      : 9
min      : 1
anyMatch : true
allMatch : true
noneMatch: true
findFirst: 4
sum=23 product=504
avg=4.6 max=9
```

## Collecting into containers

```java
import java.util.*;
import java.util.stream.*;

public class Collecting {
    public static void main(String[] args) {
        List<String> words = List.of("go", "java", "rust", "c", "kotlin");

        List<String> list = words.stream().filter(w -> w.length() > 2).toList();
        Set<Integer> lens = words.stream().map(String::length).collect(Collectors.toSet());
        Map<String, Integer> byWord = words.stream()
                .collect(Collectors.toMap(w -> w, String::length));
        String joined = words.stream().collect(Collectors.joining(", ", "[", "]"));

        System.out.println(list);
        System.out.println(lens);
        System.out.println(byWord);
        System.out.println(joined);
    }
}
```

**Output:**

```
[java, rust, kotlin]
[1, 2, 4, 6]
{c=1, rust=4, go=2, java=4, kotlin=6}
[go, java, rust, c, kotlin]
```

⚠️ `toMap` throws `IllegalStateException` on duplicate keys — pass a merge function:
`Collectors.toMap(k, v, (a, b) -> a)`.

## groupingBy — SQL GROUP BY in one line

```java
import java.util.*;
import java.util.stream.*;

public class Grouping {
    record Employee(String name, String dept, int salary) { }

    public static void main(String[] args) {
        List<Employee> staff = List.of(
                new Employee("Anil", "Eng", 1200),
                new Employee("Balu", "Sales", 800),
                new Employee("Chitra", "Eng", 1500),
                new Employee("Dev", "Sales", 950),
                new Employee("Esha", "HR", 700));

        // group names by department
        Map<String, List<String>> byDept = staff.stream()
                .collect(Collectors.groupingBy(Employee::dept,
                         Collectors.mapping(Employee::name, Collectors.toList())));
        System.out.println(byDept);

        // count per department
        Map<String, Long> headcount = staff.stream()
                .collect(Collectors.groupingBy(Employee::dept, Collectors.counting()));
        System.out.println(headcount);

        // average salary per department
        Map<String, Double> avgSalary = staff.stream()
                .collect(Collectors.groupingBy(Employee::dept,
                         Collectors.averagingInt(Employee::salary)));
        System.out.println(avgSalary);

        // top earner per department
        Map<String, Optional<Employee>> top = staff.stream()
                .collect(Collectors.groupingBy(Employee::dept,
                         Collectors.maxBy(Comparator.comparingInt(Employee::salary))));
        top.forEach((d, e) -> System.out.println(d + " top: " + e.orElseThrow().name()));

        // partition: exactly two buckets by a predicate
        Map<Boolean, List<String>> wellPaid = staff.stream()
                .collect(Collectors.partitioningBy(e -> e.salary() >= 900,
                         Collectors.mapping(Employee::name, Collectors.toList())));
        System.out.println("≥900: " + wellPaid.get(true) + "  <900: " + wellPaid.get(false));
    }
}
```

**Output:**

```
{Eng=[Anil, Chitra], HR=[Esha], Sales=[Balu, Dev]}
{Eng=2, HR=1, Sales=2}
{Eng=1350.0, HR=700.0, Sales=875.0}
Eng top: Chitra
HR top: Esha
Sales top: Dev
{≥900: [Anil, Chitra, Dev]  <900: [Balu, Esha]}
```

(Map iteration order may vary — `groupingBy` returns a `HashMap`.)

## Classic interview one-liners

```java
import java.util.*;
import java.util.stream.*;

public class OneLiners {
    public static void main(String[] args) {
        String text = "the quick brown fox jumps over the lazy dog the end";

        // word frequency
        Map<String, Long> freq = Arrays.stream(text.split(" "))
                .collect(Collectors.groupingBy(w -> w, Collectors.counting()));
        System.out.println("'the' appears " + freq.get("the") + " times");

        // char frequency of a string
        Map<Character, Long> chars = "banana".chars()
                .mapToObj(c -> (char) c)
                .collect(Collectors.groupingBy(c -> c, TreeMap::new, Collectors.counting()));
        System.out.println(chars);

        // second highest number
        Optional<Integer> second = Stream.of(12, 35, 1, 10, 34)
                .sorted(Comparator.reverseOrder()).skip(1).findFirst();
        System.out.println("second highest = " + second.orElseThrow());

        // find duplicates
        Set<Integer> seen = new HashSet<>();
        List<Integer> dups = Stream.of(4, 2, 7, 4, 2, 9)
                .filter(n -> !seen.add(n)).toList();
        System.out.println("duplicates = " + dups);
    }
}
```

**Output:**

```
'the' appears 3 times
{a=3, b=1, n=2}
second highest = 34
duplicates = [4, 2]
```

## A note on parallelStream()

`list.parallelStream()` splits work across CPU cores. It only pays off for **large data +
CPU-heavy, independent operations** — for small lists the splitting overhead makes it
*slower*. Never use it with side effects or ordered dependencies. Measure before you
commit.

> 💡 **Interview line:** "groupingBy + a downstream collector (counting, mapping,
> averaging…) answers 80% of 'aggregate this data' questions in one expression."
