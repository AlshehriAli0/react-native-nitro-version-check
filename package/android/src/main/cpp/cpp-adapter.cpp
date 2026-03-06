#include <jni.h>
#include "NitroVersionCheckOnLoad.hpp"

JNIEXPORT jint JNICALL JNI_OnLoad(JavaVM* vm, void*) {
  return margelo::nitro::nitroversioncheck::initialize(vm);
}
