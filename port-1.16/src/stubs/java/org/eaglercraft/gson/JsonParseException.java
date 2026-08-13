package org.eaglercraft.gson;
public class JsonParseException extends RuntimeException {
    public JsonParseException(String msg) { super(msg); }
    public JsonParseException(Throwable t) { super(t); }
}
