---
title: NIO & NIO.2
icon: ⚡
blurb: Paths, the Files toolbox, buffers and channels, asynchronous file IO and directory watching — plus how NIO differs from classic stream IO.
---
# NIO & NIO.2
## NIO.2 File System
### [Path & Paths](lesson:a09-nio/01-path)
- Path = address on an envelope: root + names, no disk access
- `Path.of` (11+) = `Paths.get`; root is not a name
- resolve joins, relativize finds the way, normalize tidies dots
- Comments were from Windows: `\home\user`, `C:\...`
### [The Files Class](lesson:a09-nio/02-files)
- Small file: `readString`/`readAllLines`; big file: `lines` in try-with-resources
- Default write = CREATE, TRUNCATE_EXISTING, WRITE; APPEND needs CREATE
- UTF-8 by default and strict: `MalformedInputException`
- Garbled first line = FileChannel wrote without truncating
## Buffers & Channels
### [Buffers](lesson:a09-nio/03-buffers)
- capacity, limit, position: put → flip → get
- clear forgets, compact keeps, rewind replays
- Heap vs direct; ByteBuffer is big-endian
### [FileChannel & IO vs NIO](lesson:a09-nio/04-filechannel)
- Two-way, random access, transferTo, map, lock
- Always loop: `while (buf.hasRemaining()) write(buf)`
- `"rw"` never truncates
- IO = stream + blocking; NIO = buffer + channel + Selector
### [AsynchronousFileChannel](lesson:a09-nio/05-asynchronous-file-channel)
- Returns at once: Future (buzzer) or CompletionHandler (callback)
- No position: every call passes one
- Never `while (!isDone()) {}` — use `get()`
- Linux: thread pool; Windows: IO completion ports
## File Watching
### [WatchService](lesson:a09-nio/06-watchservice)
- register dir → take → pollEvents → reset
- context is relative; directories only; not recursive
- `reset()` false = key invalid
- Hard-coded `C:\...` path → NoSuchFileException on Linux
