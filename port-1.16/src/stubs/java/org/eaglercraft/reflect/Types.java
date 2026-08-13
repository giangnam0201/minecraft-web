package org.eaglercraft.reflect;
interface Type {}
class ParameterizedType implements Type {}
class GenericArrayType implements Type {}
class WildcardType implements Type {}
class TypeVariable implements Type {}
class Method { public String getName() { return ""; } public Object invoke(Object obj, Object... args) { return null; } }
class Field { public String getName() { return ""; } public Object get(Object obj) { return null; } }
class Constructor { public Object newInstance(Object... args) { return null; } }
