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
				languageVersion = JavaLanguageVersion.of(17)
			}
		}
	}
}

java {
	sourceCompatibility = JavaVersion.VERSION_17
	targetCompatibility = JavaVersion.VERSION_17
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
}

tasks.withType<JavaCompile> {
    options.encoding = "UTF-8"
    options.compilerArgs.addAll(listOf(
        "--add-exports", "java.base/java.net=ALL-UNNAMED"
    ))
}

tasks.withType<Jar> {
    entryCompression = ZipEntryCompression.STORED
}
