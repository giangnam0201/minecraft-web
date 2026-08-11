EMCC = emcc
EMCC_FLAGS = -O2 -s WASM=1 -s ALLOW_MEMORY_GROWTH=1 \
             -s EXPORTED_FUNCTIONS='["_jvm_init","_jvm_load_class","_jvm_execute","_jvm_invoke_static","_jvm_find_class","_malloc","_free"]' \
             -s EXPORTED_RUNTIME_METHODS='["ccall","cwrap","getValue","setValue","UTF8ToString","stringToUTF8","lengthBytesUTF8"]' \
             -s NO_EXIT_RUNTIME=1 \
             -s INITIAL_MEMORY=201326592 \
             -s STACK_SIZE=2097152 \
             -s MAXIMUM_MEMORY=402653184 \
             -s ERROR_ON_UNDEFINED_SYMBOLS=0

JVM_SOURCES = jvm/jvm.c jvm/bytecode.c jvm/native.c
JVM_OUTPUT = public/jvm.js

.PHONY: all clean serve

all: $(JVM_OUTPUT)
	@echo "Build complete: $(JVM_OUTPUT)"

$(JVM_OUTPUT): $(JVM_SOURCES) jvm/jvm.h
	$(EMCC) $(EMCC_FLAGS) $(JVM_SOURCES) -o $(JVM_OUTPUT)

clean:
	rm -f $(JVM_OUTPUT) public/jvm.wasm

serve:
	cd public && python3 -m http.server 8080
