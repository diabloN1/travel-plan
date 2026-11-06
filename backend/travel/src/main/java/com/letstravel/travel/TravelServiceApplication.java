package com.letstravel.travel;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.context.annotation.Import;

import com.letstravel.common.exception.GlobalExceptionHandler;

@SpringBootApplication
@EnableFeignClients
@Import(GlobalExceptionHandler.class)
public class TravelServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(TravelServiceApplication.class, args);
	}

}
