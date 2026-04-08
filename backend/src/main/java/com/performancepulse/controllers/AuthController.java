package com.performancepulse.controllers;

import com.performancepulse.models.User;
import com.performancepulse.repositories.UserRepository;
import com.performancepulse.security.JwtUtils;
import com.performancepulse.security.UserDetailsImpl;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder encoder;
    private final JwtUtils jwtUtils;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        // Bypass authentication manager and accept any login
        String role = loginRequest.getRole();
        if (role == null) {
            role = "student";
        }
        
        String springRole = role.equalsIgnoreCase("admin") ? "ROLE_ADMIN" : "ROLE_STUDENT";

        String targetEmail = loginRequest.getEmail() != null ? loginRequest.getEmail() : "user@example.com";
        User user = userRepository.findByEmail(targetEmail).orElse(null);

        if (user == null) {
            String defaultName = targetEmail;
            if (defaultName.contains("@")) {
                defaultName = defaultName.substring(0, defaultName.indexOf("@"));
            }
            if (defaultName.length() > 0) {
                defaultName = defaultName.substring(0, 1).toUpperCase() + defaultName.substring(1);
            }

            user = User.builder()
                .name(defaultName)
                .email(targetEmail)
                .password(encoder.encode(loginRequest.getPassword() != null ? loginRequest.getPassword() : "password"))
                .role(springRole)
                .build();
            user = userRepository.save(user);
        } else {
            user.setRole(springRole);
            user = userRepository.save(user);
        }

        UserDetailsImpl userDetails = new UserDetailsImpl(
                user.getId(), 
                user.getName(), 
                user.getEmail(), 
                user.getPassword(), 
                user.getRole(), 
                java.util.Arrays.asList(new org.springframework.security.core.authority.SimpleGrantedAuthority(user.getRole())));
                
        Authentication authentication = new UsernamePasswordAuthenticationToken(
                userDetails, null, userDetails.getAuthorities());

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        return ResponseEntity.ok(new JwtResponse(jwt,
                userDetails.getId(),
                userDetails.getName(),
                userDetails.getEmail(),
                userDetails.getRole()));
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody SignupRequest signUpRequest) {
        if (userRepository.findByEmail(signUpRequest.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Error: Email is already in use!");
        }

        // Create new user's account
        User user = User.builder()
                .name(signUpRequest.getName())
                .email(signUpRequest.getEmail())
                .password(encoder.encode(signUpRequest.getPassword()))
                .role(signUpRequest.getRole() != null ? signUpRequest.getRole() : "student")
                .build();

        userRepository.save(user);

        return ResponseEntity.ok("User registered successfully!");
    }
}

@Data
class LoginRequest {
    private String email;
    private String password;
    private String role;
}

@Data
class SignupRequest {
    private String name;
    private String email;
    private String password;
    private String role;
}

@Data
class JwtResponse {
    private String token;
    private String type = "Bearer";
    private Long id;
    private String name;
    private String email;
    private String role;

    public JwtResponse(String accessToken, Long id, String name, String email, String role) {
        this.token = accessToken;
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
    }
}
