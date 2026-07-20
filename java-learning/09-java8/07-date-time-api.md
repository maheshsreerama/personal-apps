# The Date/Time API (java.time)

## Why the old Date/Calendar died

`java.util.Date` was mutable, not thread-safe, months started at 0, and formatting lived
in another class. Java 8's `java.time` package fixed all of it: **immutable**,
thread-safe, fluent types.

## The main types

| Type | Represents | Example |
|------|-----------|---------|
| `LocalDate` | date only | 2026-07-20 |
| `LocalTime` | time only | 14:30:05 |
| `LocalDateTime` | date + time, no zone | 2026-07-20T14:30 |
| `ZonedDateTime` | date + time + timezone | 2026-07-20T14:30+05:30[Asia/Kolkata] |
| `Instant` | a point on the UTC timeline | 1789000000 epoch seconds |
| `Duration` | time-based amount | "2 hours 30 minutes" |
| `Period` | date-based amount | "1 year 2 months 3 days" |

## Creating and reading

```java
import java.time.*;

public class CreateDates {
    public static void main(String[] args) {
        LocalDate independence = LocalDate.of(1947, Month.AUGUST, 15);
        LocalTime lunch = LocalTime.of(12, 30);
        LocalDateTime meeting = LocalDateTime.of(2026, 3, 14, 9, 0);

        System.out.println(independence);
        System.out.println("day of week : " + independence.getDayOfWeek());
        System.out.println("day of year : " + independence.getDayOfYear());
        System.out.println("leap year?  : " + independence.isLeapYear());
        System.out.println(lunch.plusMinutes(45));
        System.out.println(meeting.getMonth() + " " + meeting.getDayOfMonth());
    }
}
```

**Output:**

```
1947-08-15
day of week : FRIDAY
day of year : 227
leap year?  : false
13:15
MARCH 14
```

## Immutable arithmetic — every operation returns a NEW object

```java
import java.time.*;

public class DateMath {
    public static void main(String[] args) {
        LocalDate d = LocalDate.of(2026, 1, 31);

        LocalDate nextWeek = d.plusWeeks(1);
        LocalDate lastMonth = d.minusMonths(1);   // smart: clamps to Dec 31
        LocalDate firstOfMonth = d.withDayOfMonth(1);

        System.out.println("original    : " + d);       // unchanged!
        System.out.println("plusWeeks   : " + nextWeek);
        System.out.println("minusMonths : " + lastMonth);
        System.out.println("firstOfMonth: " + firstOfMonth);
    }
}
```

**Output:**

```
original    : 2026-01-31
plusWeeks   : 2026-02-07
minusMonths : 2025-12-31
firstOfMonth: 2026-01-01
```

## Period & Duration — measuring gaps

```java
import java.time.*;
import java.time.temporal.ChronoUnit;

public class Gaps {
    public static void main(String[] args) {
        LocalDate birth = LocalDate.of(2000, 6, 15);
        LocalDate today = LocalDate.of(2026, 7, 20);

        Period age = Period.between(birth, today);
        System.out.println("age: " + age.getYears() + "y "
                + age.getMonths() + "m " + age.getDays() + "d");

        long totalDays = ChronoUnit.DAYS.between(birth, today);
        System.out.println("days alive: " + totalDays);

        Duration movie = Duration.ofMinutes(142);
        System.out.println("movie: " + movie.toHours() + "h "
                + movie.toMinutesPart() + "min");
    }
}
```

**Output:**

```
age: 26y 1m 5d
days alive: 9531
movie: 2h 22min
```

## Formatting & parsing

```java
import java.time.*;
import java.time.format.DateTimeFormatter;

public class Formatting {
    public static void main(String[] args) {
        LocalDateTime dt = LocalDateTime.of(2026, 7, 20, 18, 45);

        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("dd MMM yyyy, hh:mm a");
        System.out.println(dt.format(fmt));

        LocalDate parsed = LocalDate.parse("25/12/2026",
                DateTimeFormatter.ofPattern("dd/MM/yyyy"));
        System.out.println(parsed.getDayOfWeek());
    }
}
```

**Output:**

```
20 Jul 2026, 06:45 PM
FRIDAY
```

Pattern letters: `y` year, `M` month, `d` day, `H` 24-hour, `h` 12-hour, `m` minute,
`s` second, `a` AM/PM, `E` weekday.

## Time zones & Instant

```java
import java.time.*;

public class Zones {
    public static void main(String[] args) {
        Instant moment = Instant.parse("2026-07-20T12:00:00Z");   // UTC point

        ZonedDateTime india = moment.atZone(ZoneId.of("Asia/Kolkata"));
        ZonedDateTime newYork = moment.atZone(ZoneId.of("America/New_York"));

        System.out.println("UTC      : " + moment);
        System.out.println("India    : " + india.toLocalTime());
        System.out.println("New York : " + newYork.toLocalTime());
    }
}
```

**Output:**

```
UTC      : 2026-07-20T12:00:00Z
India    : 17:30
New York : 08:00
```

**Rule:** store/pass timestamps as `Instant` (UTC); convert to a `ZonedDateTime` only at
the display edge.

> 💡 **Interview line:** "Period is calendar arithmetic (years/months/days), Duration is
> clock arithmetic (hours/seconds) — adding one month is a Period idea, adding 30 days
> of seconds is a Duration idea, and across DST they differ."
