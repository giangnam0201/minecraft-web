package org.eaglercraft.util;
public class ForkJoinPool {
    public ForkJoinPool() {}
    public ForkJoinPool(int p) {}
    public ForkJoinPool(int p, Object factory, Object handler, boolean asyncMode) {}
    public static ForkJoinPool commonPool() { return new ForkJoinPool(); }
    public void execute(Runnable task) { task.run(); }
    public void shutdown() {}
}
