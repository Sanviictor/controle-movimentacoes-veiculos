package com.controle.Controle_veiculo.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class WebSecurityConfig {

    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.cors() // habilita o CORS configurado no WebConfig
        .and()
        .csrf().disable()
        .authorizeHttpRequests(auth -> auth.anyRequest().permitAll());
        return http.build();
    }
}
