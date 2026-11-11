package com.letstravel.travel.mapper;

import com.letstravel.travel.dto.request.DestinationRequest;
import com.letstravel.travel.dto.response.DestinationResponse;
import com.letstravel.travel.entity.Destination;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(
        componentModel = "spring",
        uses = ActivityMapper.class
)
public interface DestinationMapper {

    Destination toEntity(DestinationRequest request);

    DestinationResponse toResponse(Destination destination);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "activities", ignore = true)
    @Mapping(target = "travels", ignore = true)
    void updateEntity(
            DestinationRequest request,
            @MappingTarget Destination destination
    );
}