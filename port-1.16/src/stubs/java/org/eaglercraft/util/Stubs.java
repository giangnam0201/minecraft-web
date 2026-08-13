package org.eaglercraft.util;
public class ForkJoinPool {
    public ForkJoinPool() {}
    public ForkJoinPool(int p) {}
    public static ForkJoinPool commonPool() { return new ForkJoinPool(); }
    public void execute(Runnable task) { task.run(); }
    public void shutdown() {}
}
class Executors {
    public static java.util.concurrent.ExecutorService newSingleThreadExecutor() { return null; }
    public static java.util.concurrent.ExecutorService newFixedThreadPool(int n) { return null; }
    public static java.util.concurrent.ExecutorService newCachedThreadPool() { return null; }
}
interface ThreadFactory {
    Thread newThread(Runnable r);
}
abstract class ForkJoinTask<T> {}
class UUID {
    public UUID(long a, long b) {}
}
