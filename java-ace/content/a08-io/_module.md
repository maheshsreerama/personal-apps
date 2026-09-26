---
title: IO & Serialization
icon: 📁
blurb: Files, byte vs character streams, buffering and try-with-resources, then turning objects into bytes and back — safely.
---
# IO & Serialization
## File Handling
### [The File Class](lesson:a08-io/01-file-class)
- `File` = a path, not the contents; `new File()` touches nothing
- Relative paths resolve against `user.dir`
- `createNewFile()` is atomic, returns false if it exists, never overwrites
- Silent `false`/`null` results; prefer `Path` + `Files` for new code
### [FileWriter](lesson:a08-io/02-filewriter)
- Four roots: InputStream/OutputStream (bytes), Reader/Writer (chars)
- FileWriter = OutputStreamWriter + FileOutputStream; opening truncates unless `append = true`
- No close/flush = lost data
- Default charset UTF-8 since JDK 18 (JEP 400); pass a Charset anyway
### [FileReader](lesson:a08-io/03-filereader)
- `read()` returns int: char code or -1 at end
- `read(char[])` returns a count; use only the first n chars
- Wrong charset = mojibake or U+FFFD; never read binary with a Reader
### [BufferedWriter & try-with-resources](lesson:a08-io/04-bufferedwriter)
- Decorator: is-a and has-a Writer; 8192-char buffer; `newLine()`
- Close the outermost decorator; it closes the chain
- TWR: reverse close order, before catch/finally, body exception wins, close exception suppressed
### [BufferedReader](lesson:a08-io/05-bufferedreader)
- `readLine()` strips terminators; `""` = blank line, `null` = end
- One `readLine()` per loop iteration
- Faster than Scanner; NIO helpers throw on bad bytes, FileReader replaces
## Serialization
### [Serialization](lesson:a08-io/06-serialization)
- `Serializable` is a marker; the whole reachable object graph is written
- `transient` and `static` fields are not saved
- Declare `serialVersionUID`, or any class change breaks old data
### [Deserialization](lesson:a08-io/07-deserialization)
- No constructor of a Serializable class runs; fields come from the bytes
- First non-serializable superclass needs a no-arg constructor, and it runs
- `readResolve` for singletons; enums and records are special
- Never deserialize untrusted data
### [ObjectOutputStream](lesson:a08-io/08-objectoutputstream)
- Header written in the constructor; one stream = one header
- Back-references: same object twice = one copy; use `reset()`
- Custom `writeObject`/`readObject`, `Externalizable`, `writeReplace`
### [ObjectInputStream](lesson:a08-io/09-objectinputstream)
- Read in the same order as written; EOFException marks the end
- `(List<String>) readObject()` is an unchecked cast
- ObjectInputFilter allow-lists, limits, and validation in `readObject`
