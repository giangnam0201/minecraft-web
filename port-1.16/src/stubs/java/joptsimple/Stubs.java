package joptsimple;
import java.util.*;

class OptionParser {
    public OptionParser() {}
    public OptionSpecBuilder accepts(String o) { return new OptionSpecBuilder(); }
    public OptionSet parse(String[] a) { return new OptionSet(); }
    public void formatHelpWith(Object o) {}
    public void allowsUnrecognizedOptions() {}
}

class OptionSpecBuilder {
    public ArgumentAcceptingOptionSpec withRequiredArg() { return new ArgumentAcceptingOptionSpec(); }
    public ArgumentAcceptingOptionSpec ofType(Class c) { return new ArgumentAcceptingOptionSpec(); }
    public ArgumentAcceptingOptionSpec defaultsTo(Object o, Object[] os) { return new ArgumentAcceptingOptionSpec(); }
}

class ArgumentAcceptingOptionSpec extends OptionSpec {}

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
