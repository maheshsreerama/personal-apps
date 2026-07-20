# Classic String Programs

Interview staples — each with its exact output. Try to write them yourself first!

## 1. Reverse a string

```java
public class ReverseString {
    public static void main(String[] args) {
        String s = "concept";

        // way 1: StringBuilder
        System.out.println(new StringBuilder(s).reverse());

        // way 2: manual loop (what interviewers usually want)
        char[] chars = s.toCharArray();
        for (int i = 0, j = chars.length - 1; i < j; i++, j--) {
            char tmp = chars[i]; chars[i] = chars[j]; chars[j] = tmp;
        }
        System.out.println(new String(chars));
    }
}
```

**Output:**

```
tpecnoc
tpecnoc
```

## 2. Palindrome check

```java
public class Palindrome {
    static boolean isPalindrome(String s) {
        String t = s.toLowerCase().replaceAll("[^a-z0-9]", "");
        for (int i = 0, j = t.length() - 1; i < j; i++, j--) {
            if (t.charAt(i) != t.charAt(j)) return false;
        }
        return true;
    }
    public static void main(String[] args) {
        System.out.println(isPalindrome("madam"));
        System.out.println(isPalindrome("Never odd or even"));
        System.out.println(isPalindrome("java"));
    }
}
```

**Output:**

```
true
true
false
```

## 3. Count character occurrences

```java
import java.util.LinkedHashMap;
import java.util.Map;

public class CharCount {
    public static void main(String[] args) {
        String s = "banana";
        Map<Character, Integer> counts = new LinkedHashMap<>();
        for (char c : s.toCharArray()) {
            counts.merge(c, 1, Integer::sum);
        }
        System.out.println(counts);
    }
}
```

**Output:**

```
{b=1, a=3, n=2}
```

## 4. Count words

```java
public class WordCount {
    public static void main(String[] args) {
        String s = "  Java is   fun to learn  ";
        String[] words = s.trim().split("\\s+");
        System.out.println(words.length + " words");
    }
}
```

**Output:**

```
5 words
```

## 5. Anagram check

```java
import java.util.Arrays;

public class Anagram {
    static boolean isAnagram(String a, String b) {
        char[] x = a.replace(" ", "").toLowerCase().toCharArray();
        char[] y = b.replace(" ", "").toLowerCase().toCharArray();
        Arrays.sort(x);
        Arrays.sort(y);
        return Arrays.equals(x, y);
    }
    public static void main(String[] args) {
        System.out.println(isAnagram("listen", "silent"));
        System.out.println(isAnagram("hello", "world"));
    }
}
```

**Output:**

```
true
false
```

## 6. Remove duplicate characters

```java
public class RemoveDuplicates {
    public static void main(String[] args) {
        String s = "programming";
        StringBuilder out = new StringBuilder();
        for (char c : s.toCharArray()) {
            if (out.indexOf(String.valueOf(c)) < 0) out.append(c);
        }
        System.out.println(out);
    }
}
```

**Output:**

```
progamin
```

## 7. First non-repeated character

```java
import java.util.LinkedHashMap;
import java.util.Map;

public class FirstUnique {
    public static void main(String[] args) {
        String s = "swiss";
        Map<Character, Integer> counts = new LinkedHashMap<>();
        for (char c : s.toCharArray()) counts.merge(c, 1, Integer::sum);

        for (Map.Entry<Character, Integer> e : counts.entrySet()) {
            if (e.getValue() == 1) {
                System.out.println("first unique: " + e.getKey());
                return;
            }
        }
        System.out.println("none");
    }
}
```

**Output:**

```
first unique: w
```

## 8. Reverse words in a sentence

```java
public class ReverseWords {
    public static void main(String[] args) {
        String s = "learn java every day";
        String[] words = s.split(" ");
        StringBuilder out = new StringBuilder();
        for (int i = words.length - 1; i >= 0; i--) {
            out.append(words[i]);
            if (i > 0) out.append(' ');
        }
        System.out.println(out);
    }
}
```

**Output:**

```
day every java learn
```

> 💡 More number-based programs (fibonacci, armstrong, prime…) are in Part 12.
