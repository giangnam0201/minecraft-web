package org.eaglercraft.util;
import java.util.*;

class AtomicLongArray { public AtomicLongArray(int n) {} public long get(int i) { return 0; } public void set(int i, long v) {} }
class AtomicIntegerArray { public AtomicIntegerArray(int n) {} public int get(int i) { return 0; } public void set(int i, int v) {} }
class AtomicLong { public AtomicLong() {} public AtomicLong(long v) {} public long get() { return 0; } public void set(long v) {} public long getAndIncrement() { return 0; } public long incrementAndGet() { return 0; } }
class AtomicInteger { public AtomicInteger() {} public AtomicInteger(int v) {} public int get() { return 0; } public void set(int v) {} public int getAndIncrement() { return 0; } public int incrementAndGet() { return 0; } }
interface Lock { void lock(); void unlock(); }
class ReentrantLock implements Lock { public void lock() {} public void unlock() {} }
class ReentrantReadWriteLock { public Lock readLock() { return new ReentrantLock(); } public Lock writeLock() { return new ReentrantLock(); } }
class ConcurrentLinkedQueue<T> extends LinkedList<T> {}
class CompletionException extends RuntimeException { public CompletionException(Throwable t) { super(t); } }
class CompletableFuture<T> {
    public static <T> CompletableFuture<T> completedFuture(T v) { return new CompletableFuture<>(); }
    public static CompletableFuture<Void> allOf(CompletableFuture<?>... c) { return new CompletableFuture<>(); }
    public T join() { return null; }
    public T get() { return null; }
    public void complete(T v) {}
}
