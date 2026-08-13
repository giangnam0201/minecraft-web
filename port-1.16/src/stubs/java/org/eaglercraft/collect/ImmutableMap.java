package org.eaglercraft.collect;
import java.util.*;
public class ImmutableMap<K, V> extends HashMap<K, V> {
    public static <K, V> ImmutableMap<K, V> of() { return new ImmutableMap<>(); }
    public static <K, V> ImmutableMap<K, V> of(K k1, V v1) { return new ImmutableMap<>(); }
    public static <K, V> ImmutableMap<K, V> of(K k1, V v1, K k2, V v2) { return new ImmutableMap<>(); }
    public static <K, V> ImmutableMap<K, V> of(K k1, V v1, K k2, V v2, K k3, V v3) { return new ImmutableMap<>(); }
    public static <K, V> Builder<K, V> builder() { return new Builder<>(); }
    public static class Builder<K, V> {
        public Builder<K, V> put(K k, V v) { return this; }
        public ImmutableMap<K, V> build() { return new ImmutableMap<>(); }
    }
}
