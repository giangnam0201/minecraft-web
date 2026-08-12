package joptsimple;
import java.util.*;

class OptionParser {
    public OptionParser() {}
    public OptionSpec accepts(String o, String d) { return new OptionSpec(); }
    public OptionSet parse(String[] a) { return new OptionSet(); }
    public void formatHelpWith(Object o) {}
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
}
