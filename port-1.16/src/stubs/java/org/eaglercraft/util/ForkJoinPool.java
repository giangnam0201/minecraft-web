package org.eaglercraft.util;
public class ForkJoinPool {
    public interface ForkJoinWorkerThreadFactory {
        Thread newThread(ForkJoinPool pool);
    }
    public ForkJoinPool() {}
    public ForkJoinPool(int p) {}
    public ForkJoinPool(int p, ForkJoinWorkerThreadFactory factory, Thread.UncaughtExceptionHandler handler, boolean asyncMode) {}
    public static ForkJoinPool commonPool() { return new ForkJoinPool(); }
    public void execute(Runnable task) { task.run(); }
    public void shutdown() {}
}
