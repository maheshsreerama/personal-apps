---
title: Executors, Callable & Future
icon: 🏊
blurb: Thread pools and ThreadPoolExecutor, the ExecutorService lifecycle, scheduling, and getting results back with Callable, Future and FutureTask.
---
# Executors, Callable & Future
## Thread Pools & Executors
### [Thread Pools & ThreadPoolExecutor](lesson:a07-executors/01-thread-pools)
- Reuse a few threads, queue the rest: submit tasks, don't create threads
- `execute`: core → queue → max → reject (unbounded queue = max ignored)
- The queue sets the personality: `SynchronousQueue`, unbounded `LinkedBlockingQueue`, bounded `ArrayBlockingQueue`
- `Executors.newFixed/Single/Cached` hide unbounded queues or threads: build `ThreadPoolExecutor` in production
### [ExecutorService](lesson:a07-executors/02-executor-service)
- `Executor` + lifecycle + `submit`/`invokeAll`/`invokeAny`
- `execute` failure kills the worker (printed); `submit` stores it in the `Future`
- `shutdown` → `awaitTermination` → `shutdownNow`; Java 19+ try-with-resources
- Task waiting on a task in the same full pool = starvation deadlock
### [ScheduledExecutorService](lesson:a07-executors/03-scheduled-executor-service)
- `schedule` (once), `scheduleAtFixedRate` (planned start + period), `scheduleWithFixedDelay` (end + delay)
- Runs of one periodic task never overlap; a delay is only a minimum
- An exception silently ends a periodic task: catch inside
- Replaces `Timer`: many threads, isolated failures, monotonic clock
## Callable & Future
### [Callable & Future](lesson:a07-executors/04-callable-and-future)
- `Callable<V>.call()` returns a value and may throw checked exceptions
- `submit` returns a `Future` at once; only `get()` waits
- `get()` throws `ExecutionException` (unwrap `getCause()`), `InterruptedException`, `CancellationException`, `TimeoutException`
- `cancel(true)` interrupts; Java 19 `state()`, `resultNow()`, `exceptionNow()`
### [FutureTask](lesson:a07-executors/05-futuretask)
- Runnable + Future in one object: the thing `submit` returns
- Run it with `new Thread(ft)`, `execute(ft)` or `ft.run()`, never `submit(ft)` (double wrap, `get()` = null)
- Runs at most once; CAS state machine NEW → NORMAL / EXCEPTIONAL / CANCELLED
- `done()` hook for callbacks; memoizer: `putIfAbsent` a `FutureTask`, the winner runs it
