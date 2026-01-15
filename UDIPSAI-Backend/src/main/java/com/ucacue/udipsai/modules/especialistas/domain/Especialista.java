package com.ucacue.udipsai.modules.especialistas.domain;

import com.ucacue.udipsai.modules.especialidad.domain.Especialidad;
import com.ucacue.udipsai.modules.pasante.domain.Pasante;
import com.ucacue.udipsai.modules.permisos.Permisos;
import com.ucacue.udipsai.modules.sedes.domain.Sede;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;
import java.util.List;

@Entity
@Table(name = "especialistas")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Especialista extends com.ucacue.udipsai.modules.usuarios.domain.UsuarioAtencion {

    @OneToMany(mappedBy = "especialista", fetch = FetchType.LAZY)
    @ToString.Exclude
    private List<Pasante> pasantesAsignados;

}
