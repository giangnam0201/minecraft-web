package org.eaglercraft.util;
public class ForkJoinPool {
    public ForkJoinPool() {}
    public ForkJoinPool(int p) {}
    public static ForkJoinPool commonPool() { return new ForkJoinPool(); }
    public void execute(Runnable task) { task.run(); }
    public void shutdown() {}
}
