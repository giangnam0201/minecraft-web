package java.util.concurrent.locks;
public class ReentrantReadWriteLock { public Lock readLock() { return new ReentrantLock(); } public Lock writeLock() { return new ReentrantLock(); } }
