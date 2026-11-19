package com.letstravel.travel.mapper;

import com.letstravel.travel.dto.request.ActivityRequest;
import com.letstravel.travel.dto.response.ActivitySummaryResponse;
import com.letstravel.travel.entity.Activity;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface ActivityMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "destination", ignore = true)
    Activity toEntity(ActivityRequest request);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "destination", ignore = true)
    void updateEntity(
            ActivityRequest request,
            @MappingTarget Activity activity);

    List<Activity> toEntities(List<ActivityRequest> requests);

    ActivitySummaryResponse toResponse(Activity activity);
}
