package com.ucacue.udipsai.modules.paciente.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PacienteSummaryDTO {
    private Integer totalFichas;
    private List<String> nombresFichas;
}
