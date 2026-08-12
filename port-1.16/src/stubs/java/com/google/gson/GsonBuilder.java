package com.google.gson;
public class GsonBuilder {
    public GsonBuilder() {}
    public GsonBuilder registerTypeAdapterFactory(Object f) { return this; }
    public Gson create() { return new Gson(); }
}
