package org.eaglercraft.gson.stream;
public class JsonReader {
    public JsonReader(java.io.Reader r) {}
    public void beginObject() {}
    public void endObject() {}
    public void beginArray() {}
    public void endArray() {}
    public boolean hasNext() { return false; }
    public String nextName() { return ""; }
    public String nextString() { return ""; }
    public int nextInt() { return 0; }
    public long nextLong() { return 0; }
    public double nextDouble() { return 0; }
    public boolean nextBoolean() { return false; }
    public void skipValue() {}
    public void close() {}
}
