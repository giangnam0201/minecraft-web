plugins {
	id("java")
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
			"src/platform-api/java"
		)
	}
}

dependencies {
    implementation(files("libs/minecraft-1.16.5-deobf.jar"))
}

tasks.withType<Jar> {
	entryCompression = ZipEntryCompression.STORED
}
