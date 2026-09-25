#!/usr/bin/env bash
# Runs every example in source-material on a real JDK and records its console output
# into outputs/<path>.txt. Each example runs up to five times; if any run differs the output
# is marked with outputs/<path>.varies (thread timing, timestamps, hash codes...).
# Usage: tools/run-examples.sh [workdir]   (needs JDK 17+ and curl)
set -u
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
WORK="${1:-$(mktemp -d)}"
SRC="$ROOT/source-material"
OUT="$ROOT/outputs"
LIB="$WORK/lib"
mkdir -p "$LIB" "$WORK/classes" "$WORK/run"
M=https://repo1.maven.org/maven2
for u in org/projectlombok/lombok/1.18.32/lombok-1.18.32.jar \
         org/openjfx/javafx-base/17/javafx-base-17-linux.jar \
         org/openjdk/nashorn/nashorn-core/15.4/nashorn-core-15.4.jar \
         org/ow2/asm/asm/7.3.1/asm-7.3.1.jar org/ow2/asm/asm-commons/7.3.1/asm-commons-7.3.1.jar \
         org/ow2/asm/asm-tree/7.3.1/asm-tree-7.3.1.jar org/ow2/asm/asm-util/7.3.1/asm-util-7.3.1.jar \
         org/ow2/asm/asm-analysis/7.3.1/asm-analysis-7.3.1.jar; do
  f="$LIB/$(basename $u)"
  [ -s "$f" ] && [ "$(stat -c%s "$f")" -gt 1000 ] || curl -sSL -o "$f" "$M/$u"
done
CP="$WORK/classes:$(ls "$LIB"/*.jar | tr '\n' ':')"
# --release 17: MVVMExample has a stray ';' after an import, which JDK 21+ rejects.
javac -nowarn --release 17 -cp "$CP" -processorpath "$LIB/lombok-1.18.32.jar" \
  -d "$WORK/classes" $(find "$SRC" -name '*.java' ! -path '*/_project/*') || exit 1

# Writers run before readers so the file-based examples see the files they expect.
ORDER="IO/FileHandling/FileHandlingExample IO/FileHandling/FileWriterExample IO/FileHandling/FileReaderExample
IO/FileHandling/BufferedWriterExample IO/FileHandling/BufferedReaderExample
IO/SerializationAndDeserialization/SerializationExample IO/SerializationAndDeserialization/DeserializationExample
IO/SerializationAndDeserialization/ObjectOutputStreamExample IO/SerializationAndDeserialization/ObjectInputStreamExample
NIO/FileChannelExample NIO/FilesExample"
ALL="$(echo $ORDER | tr ' ' '\n'; cd "$SRC" && find . -name '*.java' ! -path './_project/*' | sed 's|^\./||; s|\.java$||' | sort)"

run() { # $1 = path without .java
  (cd "$WORK/run" && timeout 20 java -cp "$CP" "$(echo "$1" | tr / .)" 2>&1) \
    | sed "/^Picked up JAVA_TOOL_OPTIONS/d; s|$WORK/run|/home/you/project|g"
}
rm -rf "$OUT"; mkdir -p "$OUT"
for p in $(echo "$ALL" | awk '!seen[$0]++'); do
  mkdir -p "$OUT/$(dirname "$p")"
  run "$p" > "$OUT/$p.txt"
  case "$p" in IO/*|NIO/*) continue;; esac  # file examples are order-dependent, one run
  for i in 1 2 3 4; do  # thread timing only shows up sometimes, so compare several runs
    [ "$(run "$p")" == "$(cat "$OUT/$p.txt")" ] || { touch "$OUT/$p.varies"; break; }
  done
  echo "done $p"
done
echo "Outputs in $OUT"
