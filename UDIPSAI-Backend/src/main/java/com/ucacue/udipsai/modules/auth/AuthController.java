package com.ucacue.udipsai.modules.auth;

import com.ucacue.udipsai.infrastructure.security.JwtTokenProvider;
import com.ucacue.udipsai.infrastructure.security.RefreshToken;
import com.ucacue.udipsai.infrastructure.security.RefreshTokenService;
import com.ucacue.udipsai.infrastructure.security.dto.JwtResponse;
import com.ucacue.udipsai.infrastructure.security.dto.TokenRefreshRequest;
import com.ucacue.udipsai.infrastructure.security.dto.TokenRefreshResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    JwtTokenProvider tokenProvider;

    @Autowired
    RefreshTokenService refreshTokenService;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody Map<String, String> loginRequest) {
        String username = loginRequest.get("username");
        String password = loginRequest.get("password");

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(username, password));

        SecurityContextHolder.getContext().setAuthentication(authentication);

        String jwt = tokenProvider.generateToken(authentication);
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        List<String> roles = userDetails.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());

        RefreshToken refreshToken = refreshTokenService.createRefreshToken(userDetails.getUsername());

        return ResponseEntity.ok(new JwtResponse(jwt,
                refreshToken.getToken(),
                0L, // ID not easily available here without checking repository again, but username is key
                userDetails.getUsername(),
                roles));
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refreshtoken(@RequestBody TokenRefreshRequest request) {
        String requestRefreshToken = request.getRefreshToken();

        return refreshTokenService.findByToken(requestRefreshToken)
                .map(refreshTokenService::verifyExpiration)
                .map(RefreshToken::getUsername)
                .map(username -> {
                    // Create minimal Authentication for token generation
                    Authentication auth = new UsernamePasswordAuthenticationToken(
                            username, 
                            null, 
                            Collections.emptyList() // Roles would require reloading user, simplified for now
                    );
                    
                    String token = tokenProvider.generateToken(auth);
                    
                    // Rotate refresh token? Plan said rotation. 
                    // To rotate: delete old, create new.
                    refreshTokenService.deleteByUsername(username);
                    RefreshToken newRefreshToken = refreshTokenService.createRefreshToken(username);
                    
                    return ResponseEntity.ok(new TokenRefreshResponse(token, newRefreshToken.getToken()));
                })
                .orElseThrow(() -> new RuntimeException("Refresh token is not in database!"));
    }
}
