package java.net;
public class Proxy {
    public enum Type { DIRECT, HTTP, SOCKS }
    public static Proxy NO_PROXY = new Proxy();
    public Proxy() {}
}
class Authenticator {}
