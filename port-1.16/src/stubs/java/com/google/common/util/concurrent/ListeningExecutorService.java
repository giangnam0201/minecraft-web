package com.google.common.util.concurrent;
public class ListeningExecutorService implements java.util.concurrent.ExecutorService {
    public void shutdown() {}
    public java.util.List<Runnable> shutdownNow() { return null; }
    public boolean isShutdown() { return false; }
    public boolean isTerminated() { return false; }
    public boolean awaitTermination(long t, java.util.concurrent.TimeUnit u) { return false; }
    public <T> java.util.concurrent.Future<T> submit(java.util.concurrent.Callable<T> c) { return null; }
    public <T> java.util.concurrent.Future<T> submit(Runnable r, T result) { return null; }
    public java.util.concurrent.Future<?> submit(Runnable r) { return null; }
    public <T> java.util.List<java.util.concurrent.Future<T>> invokeAll(java.util.Collection<? extends java.util.concurrent.Callable<T>> tasks) { return null; }
    public <T> java.util.List<java.util.concurrent.Future<T>> invokeAll(java.util.Collection<? extends java.util.concurrent.Callable<T>> tasks, long timeout, java.util.concurrent.TimeUnit unit) { return null; }
    public <T> T invokeAny(java.util.Collection<? extends java.util.concurrent.Callable<T>> tasks) { return null; }
    public <T> T invokeAny(java.util.Collection<? extends java.util.concurrent.Callable<T>> tasks, long timeout, java.util.concurrent.TimeUnit unit) { return null; }
    public void execute(Runnable r) { r.run(); }
}
