package com.ucacue.udipsai.modules.permisos;

import java.util.ArrayList;
import java.util.List;

import org.springframework.security.core.authority.SimpleGrantedAuthority;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "permisos")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Permisos {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "pacientes")
    private Boolean pacientes = false;

    @Column(name = "pasantes")
    private Boolean pasantes = false;

    @Column(name = "sedes")
    private Boolean sedes = false;

    @Column(name = "especialistas")
    private Boolean especialistas = false;

    @Column(name = "especialidades")
    private Boolean especialidades = false;

    @Column(name = "asignaciones")
    private Boolean asignaciones = false;

    @Column(name = "recursos")
    private Boolean recursos = false;

    @Column(name = "instituciones_educativas")
    private Boolean institucionesEducativas = false;

    @Column(name = "historia_clinica")
    private Boolean historiaClinica = false;

    @Column(name = "fonoaudiologia")
    private Boolean fonoAudiologia = false;

    @Column(name = "psicologia_clinica")
    private Boolean psicologiaClinica = false;

    @Column(name = "psicologia_educativa")
    private Boolean psicologiaEducativa = false;

    public List<SimpleGrantedAuthority> getAuthorities() {
        List<SimpleGrantedAuthority> authorities = new ArrayList<>();
        if (Boolean.TRUE.equals(this.pacientes))
            authorities.add(new SimpleGrantedAuthority("PERM_PACIENTES"));
        if (Boolean.TRUE.equals(this.pasantes))
            authorities.add(new SimpleGrantedAuthority("PERM_PASANTES"));
        if (Boolean.TRUE.equals(this.sedes))
            authorities.add(new SimpleGrantedAuthority("PERM_SEDES"));
        if (Boolean.TRUE.equals(this.especialistas))
            authorities.add(new SimpleGrantedAuthority("PERM_ESPECIALISTAS"));
        if (Boolean.TRUE.equals(this.especialidades))
            authorities.add(new SimpleGrantedAuthority("PERM_ESPECIALIDADES"));
        if (Boolean.TRUE.equals(this.asignaciones))
            authorities.add(new SimpleGrantedAuthority("PERM_ASIGNACIONES"));
        if (Boolean.TRUE.equals(this.recursos))
            authorities.add(new SimpleGrantedAuthority("PERM_RECURSOS"));
        if (Boolean.TRUE.equals(this.institucionesEducativas))
            authorities.add(new SimpleGrantedAuthority("PERM_INSTITUCIONES_EDUCATIVAS"));
        if (Boolean.TRUE.equals(this.historiaClinica))
            authorities.add(new SimpleGrantedAuthority("PERM_HISTORIA_CLINICA"));
        if (Boolean.TRUE.equals(this.fonoAudiologia))
            authorities.add(new SimpleGrantedAuthority("PERM_FONOAUDIOLOGIA"));
        if (Boolean.TRUE.equals(this.psicologiaClinica))
            authorities.add(new SimpleGrantedAuthority("PERM_PSICOLOGIA_CLINICA"));
        if (Boolean.TRUE.equals(this.psicologiaEducativa))
            authorities.add(new SimpleGrantedAuthority("PERM_PSICOLOGIA_EDUCATIVA"));
        return authorities;
    }
}
