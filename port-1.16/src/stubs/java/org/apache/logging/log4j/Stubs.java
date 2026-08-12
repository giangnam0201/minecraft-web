package org.apache.logging.log4j;

class Logger {
    public void info(String m) {}
    public void warn(String m) {}
    public void error(String m) {}
    public void debug(String m) {}
    public void trace(String m) {}
}

class LogManager {
    public static Logger getLogger() { return new Logger(); }
    public static Logger getLogger(String n) { return new Logger(); }
    public static Logger getLogger(Class c) { return new Logger(); }
}
