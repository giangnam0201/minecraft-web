package com.google.gson;
public class GsonBuilder {
    public GsonBuilder() {}
    public GsonBuilder registerTypeAdapterFactory(Object f) { return this; }
    public Gson create() { return new Gson(); }
}
public class Gson {
    public <T> T fromJson(String j, Class<T> c) { return null; }
    public String toJson(Object o) { return "{}"; }
}
