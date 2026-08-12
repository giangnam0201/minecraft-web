package org.apache.logging.log4j;
public class Logger { public void info(String m) {} public void warn(String m) {} public void error(String m) {} public void debug(String m) {} public void trace(String m) {} }
public class LogManager { public static Logger getLogger() { return new Logger(); } public static Logger getLogger(String n) { return new Logger(); } public static Logger getLogger(Class c) { return new Logger(); } }
