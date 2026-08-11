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
			"src/platform-api/java"
		)
	}
}

dependencies {
	// 1.16.5 deobfuscated game classes (built by scripts/deobfuscate.js)
	implementation(files("libs/minecraft-1.16.5-deobf.jar"))
	implementation(libs.bundles.common)
}

tasks.withType<Jar> {
	entryCompression = ZipEntryCompression.STORED
}
