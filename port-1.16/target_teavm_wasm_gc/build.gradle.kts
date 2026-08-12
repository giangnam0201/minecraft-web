import org.teavm.gradle.api.OptimizationLevel

plugins {
    id("java")
    id("org.teavm") version "0.12.1-EAGLER-R3"
}

java {
    sourceCompatibility = JavaVersion.VERSION_17
    targetCompatibility = JavaVersion.VERSION_17
}

sourceSets {
    named("main") {
        java.srcDirs("../src/wasm/java")
        resources.srcDirs("../src/teavm/resources")
    }
}

repositories {
    maven {
        name = "eagler-teavm"
        url = uri("https://eaglercraft-teavm-fork.github.io/maven/")
    }
    mavenCentral()
}

dependencies {
    teavm(teavm.libs.jso)
    teavm(teavm.libs.jsoApis)
    implementation(rootProject)
    implementation(files("../libs/minecraft-1.16.5-deobf.jar"))
    implementation(files("../libs/java-net-stubs.jar"))
}

tasks.withType<JavaCompile> {
    options.encoding = "UTF-8"
}

teavm.wasmGC {
    targetFileName = "classes.wasm"
    optimization = OptimizationLevel.AGGRESSIVE
    outOfProcess = false
    fastGlobalAnalysis = false
    processMemory = 512
    mainClass = "net.minecraft.client.main.Main"
    outputDir = file("build/wasm")
    properties = mapOf("java.util.TimeZone.autodetect" to "true")
    debugInformation = true
}
