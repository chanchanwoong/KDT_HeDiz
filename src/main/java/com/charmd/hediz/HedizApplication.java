package com.charmd.hediz;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.PropertySource;

@SpringBootApplication
@PropertySource(value = "classpath:custom.properties")
public class HedizApplication {

	public static void main(String[] args) {
		SpringApplication.run(HedizApplication.class, args);
	}

}
