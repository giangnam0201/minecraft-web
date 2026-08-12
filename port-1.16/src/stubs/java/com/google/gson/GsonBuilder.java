package com.google.gson;
import java.lang.reflect.Type;

public class GsonBuilder {
    public GsonBuilder() {}
    public GsonBuilder registerTypeAdapterFactory(Object f) { return this; }
    public GsonBuilder registerTypeAdapter(Type t, Object adapter) { return this; }
    public Gson create() { return new Gson(); }
}
