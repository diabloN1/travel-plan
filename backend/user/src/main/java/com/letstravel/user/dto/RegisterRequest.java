package com.letstravel.user.dto;

import jakarta.validation.constraints.*;

public record RegisterRequest(

        @NotBlank @Size(min = 3, max = 25) String firstName,

        @NotBlank @Size(min = 3, max = 25) String lastName,

        @Email @NotBlank String email,

        @NotBlank @Size(min = 8, max = 30) String password,

        @NotNull RegisterRole role

) {
}