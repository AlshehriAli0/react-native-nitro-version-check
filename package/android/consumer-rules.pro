# react-native-nitro-version-check
# Nitro Hybrid Objects are instantiated from C++ via JNI (FindClass),
# which R8 cannot trace. Keep all Nitro classes to prevent stripping.
-keep class com.margelo.nitro.nitroversioncheck.** { *; }
