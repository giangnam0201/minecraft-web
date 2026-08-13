package org.eaglercraft;
public class Runtime {
    private static final Runtime instance = new Runtime();
    public static Runtime getRuntime() { return instance; }
    public void addShutdownHook(Thread t) {}
    public void removeShutdownHook(Thread t) {}
    public long maxMemory() { return 0; }
    public long totalMemory() { return 0; }
    public long freeMemory() { return 0; }
    public int availableProcessors() { return 1; }
    public void gc() {}
    public void halt(int status) {}
}
