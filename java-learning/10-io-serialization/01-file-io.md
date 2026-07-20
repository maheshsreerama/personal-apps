# File I/O — Streams, Readers & NIO Files

## The I/O family tree

- **Byte streams** (`InputStream`/`OutputStream`) — raw bytes: images, zips, any binary.
- **Character streams** (`Reader`/`Writer`) — text with an encoding (UTF-8 etc.).
- **Buffered wrappers** — batch reads/writes for speed; always wrap file streams.
- **NIO `Files`/`Path`** — modern one-line utilities; prefer these for everyday work.

## Modern way first: java.nio.file.Files

```java
import java.io.IOException;
import java.nio.file.*;
import java.util.List;

public class NioDemo {
    public static void main(String[] args) throws IOException {
        Path file = Path.of("notes.txt");

        // write (creates or truncates)
        Files.writeString(file, "line one\nline two\n");
        // append
        Files.writeString(file, "line three\n", StandardOpenOption.APPEND);

        // read everything
        String all = Files.readString(file);
        System.out.print(all);

        // read as lines
        List<String> lines = Files.readAllLines(file);
        System.out.println("count = " + lines.size());

        System.out.println("exists: " + Files.exists(file)
                + ", size: " + Files.size(file) + " bytes");

        Files.delete(file);
        System.out.println("deleted: " + !Files.exists(file));
    }
}
```

**Output:**

```
line one
line two
line three
count = 3
exists: true, size: 30 bytes
deleted: true
```

## Streaming big files line by line

`Files.lines` returns a lazy stream — the whole file never sits in memory:

```java
import java.io.IOException;
import java.nio.file.*;
import java.util.stream.Stream;

public class BigFileDemo {
    public static void main(String[] args) throws IOException {
        Path log = Path.of("app.log");
        Files.write(log, java.util.List.of(
                "INFO boot", "ERROR disk full", "INFO retry", "ERROR net down"));

        try (Stream<String> lines = Files.lines(log)) {   // close the stream!
            long errors = lines.filter(l -> l.startsWith("ERROR")).count();
            System.out.println("errors = " + errors);
        }
        Files.delete(log);
    }
}
```

**Output:**

```
errors = 2
```

## Classic BufferedReader / BufferedWriter

Still everywhere in real codebases and interviews:

```java
import java.io.*;

public class ClassicIo {
    public static void main(String[] args) throws IOException {
        File f = new File("classic.txt");

        try (BufferedWriter bw = new BufferedWriter(new FileWriter(f))) {
            bw.write("hello classic io");
            bw.newLine();
            bw.write("second line");
        }                                          // auto-flushed & closed

        try (BufferedReader br = new BufferedReader(new FileReader(f))) {
            String line;
            while ((line = br.readLine()) != null) {
                System.out.println("read: " + line);
            }
        }
        f.delete();
    }
}
```

**Output:**

```
read: hello classic io
read: second line
```

The `while ((line = br.readLine()) != null)` idiom is *the* classic read loop —
`readLine()` returns `null` at end of file.

## Reading user input — Scanner

```java
import java.util.Scanner;

public class ScannerDemo {
    public static void main(String[] args) {
        Scanner sc = new Scanner("42 3.14 hello");   // works on System.in the same way
        int i = sc.nextInt();
        double d = sc.nextDouble();
        String w = sc.next();
        System.out.println(i + " | " + d + " | " + w);
    }
}
```

**Output:**

```
42 | 3.14 | hello
```

⚠️ Mixing `nextInt()` and `nextLine()` on `System.in`? The leftover newline after
`nextInt()` makes the next `nextLine()` return "" — add an extra `nextLine()` to consume
it.

## Walking directories

```java
import java.io.IOException;
import java.nio.file.*;

public class WalkDemo {
    public static void main(String[] args) throws IOException {
        Path dir = Files.createTempDirectory("demo");
        Files.writeString(dir.resolve("a.txt"), "x");
        Files.writeString(dir.resolve("b.log"), "y");

        try (var paths = Files.list(dir)) {
            paths.filter(p -> p.toString().endsWith(".txt"))
                 .forEach(p -> System.out.println("found " + p.getFileName()));
        }

        // cleanup
        try (var paths = Files.list(dir)) {
            for (Path p : paths.toList()) Files.delete(p);
        }
        Files.delete(dir);
        System.out.println("cleaned up");
    }
}
```

**Output:**

```
found a.txt
cleaned up
```

## Cheat sheet

| Task | One-liner |
|------|-----------|
| read whole file | `Files.readString(path)` |
| write whole file | `Files.writeString(path, text)` |
| read lines lazily | `Files.lines(path)` (try-with-resources!) |
| copy / move | `Files.copy(src, dst)` / `Files.move(src, dst)` |
| create dirs | `Files.createDirectories(path)` |
| recurse a tree | `Files.walk(path)` |

> 💡 Character encodings bite silently: `Files` methods default to UTF-8 (good), but old
> `FileReader` used the platform charset before Java 18 — pass
> `StandardCharsets.UTF_8` explicitly in older code.
