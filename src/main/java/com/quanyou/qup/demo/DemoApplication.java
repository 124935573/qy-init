package com.quanyou.qup.demo;


import com.quanyou.qup.security.annotation.EnableQupFeignClients;
import com.quanyou.qup.security.annotation.EnableQupResourceServer;
import org.springframework.cloud.client.SpringCloudApplication;
import org.springframework.boot.SpringApplication;
import org.springframework.context.annotation.ComponentScan;

/**
 * Demo
 *
 * @author 喻晓东
 * @since 2020-05-29
 */
@EnableQupResourceServer
@EnableQupFeignClients
@SpringCloudApplication
@ComponentScan(basePackages = {"com.quanyou.qup"})
public class DemoApplication {
    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
    }
}
