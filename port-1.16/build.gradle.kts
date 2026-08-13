plugins {
    id("java-library")
}

allprojects {
	apply(plugin = "eclipse")
	repositories {
		mavenCentral()
	}
	plugins.withId("java") {
		java {
			toolchain {
				languageVersion = JavaLanguageVersion.of(21)
			}
		}
	}
}

java {
	sourceCompatibility = JavaVersion.VERSION_21
	targetCompatibility = JavaVersion.VERSION_21
}

sourceSets {
	named("main") {
		java.srcDirs(
			"src/main/java",
			"src/platform-api/java",
			"src/stubs/java"
		)
	}
}

dependencies {
    api(files("libs/minecraft-1.16.5-deobf.jar"))
    api("com.google.code.gson:gson:2.8.6")
    api("com.google.guava:guava:30.1-jre")
    api("org.apache.commons:commons-lang3:3.12.0")
    api("org.apache.logging.log4j:log4j-api:2.14.1")
    api("net.sf.jopt-simple:jopt-simple:5.0.4")
    api("it.unimi.dsi:fastutil:8.5.6")
}

tasks.withType<JavaCompile> {
    options.encoding = "UTF-8"
}

tasks.withType<Jar> {
    entryCompression = ZipEntryCompression.STORED
}
