package com.ucacue.udipsai.util;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

/**
 * Utilidad para generar hash de contraseña BCrypt
 * Ejecutar este archivo para obtener el hash de "admin123"
 */
public class PasswordHashGenerator {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String rawPassword = "admin123";
        String hashedPassword = encoder.encode(rawPassword);
        
        System.out.println("==============================================");
        System.out.println("Contraseña sin encriptar: " + rawPassword);
        System.out.println("Contraseña encriptada: " + hashedPassword);
        System.out.println("==============================================");
        System.out.println("\nUsar este hash en el script SQL:");
        System.out.println("'" + hashedPassword + "'");
        System.out.println("==============================================");
    }
}
