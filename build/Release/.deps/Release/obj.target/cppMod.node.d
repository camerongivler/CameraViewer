cmd_Release/obj.target/cppMod.node := flock ./Release/linker.lock g++ -shared -pthread -rdynamic -m64  -Wl,-soname=cppMod.node -o Release/obj.target/cppMod.node -Wl,--start-group Release/obj.target/cppMod/cppMod.o -Wl,--end-group 
