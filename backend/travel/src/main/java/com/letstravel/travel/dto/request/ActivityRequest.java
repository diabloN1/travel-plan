package com.letstravel.travel.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ActivityRequest(
        @NotBlank @Size(max = 100) String title,
        @Size(max = 100) String description) {
}