package org.eaglercraft.network;
public class Proxy {
    public enum Type { DIRECT, HTTP, SOCKS }
    public static final Proxy NO_PROXY = new Proxy();
    public Proxy() {}
    public Proxy(Type t, SocketAddress a) {}
}
