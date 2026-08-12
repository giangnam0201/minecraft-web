package joptsimple;
import java.util.*;

class OptionParser {
    public OptionParser() {}
    public OptionSpecBuilder accepts(String o, String d) { return new OptionSpecBuilder(); }
    public OptionSet parse(String[] a) { return new OptionSet(); }
    public void formatHelpWith(Object o) {}
    public void allowsUnrecognizedOptions() {}
}

class OptionSpecBuilder {
    public OptionSpecBuilder withRequiredArg() { return this; }
    public OptionSpecBuilder ofType(Class c) { return this; }
    public OptionSpecBuilder defaultsTo(Object o, Object[] os) { return this; }
}

class OptionSet {
    public boolean has(String o) { return false; }
    public Object valueOf(String o) { return null; }
    public List valuesOf(String o) { return new ArrayList(); }
}

class OptionSpec {
    public OptionSpec withRequiredArg() { return this; }
    public OptionSpec ofType(Class c) { return this; }
    public OptionSpec defaultsTo(Object o, Object[] os) { return this; }
    public Object value(OptionSet os) { return null; }
}
