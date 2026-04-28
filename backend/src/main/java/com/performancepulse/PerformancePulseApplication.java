package com.performancepulse;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.performancepulse.models.User;
import com.performancepulse.repositories.UserRepository;

@SpringBootApplication
public class PerformancePulseApplication {

    public static void main(String[] args) {
        SpringApplication.run(PerformancePulseApplication.class, args);
    }

    @Bean
    public CommandLineRunner initData(UserRepository userRepository, PasswordEncoder passwordEncoder, com.performancepulse.controllers.StudentController studentController) {
        return args -> {
            if (userRepository.count() == 0) {
                userRepository.save(new User(null, "Admin", "admin@example.com", passwordEncoder.encode("admin123"), "ROLE_ADMIN"));
                userRepository.save(new User(null, "Student", "student@example.com", passwordEncoder.encode("password123"), "ROLE_STUDENT"));
                System.out.println("Inserted default users.");
            }
            if (studentController.getAllStudents(null).isEmpty()) {
                studentController.seedDatabase();
                System.out.println("Inserted default students and courses.");
            }
        };
    }
}
