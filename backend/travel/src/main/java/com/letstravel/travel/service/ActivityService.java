package com.letstravel.travel.service;

import com.letstravel.travel.dto.request.ActivityRequest;
import com.letstravel.travel.entity.Destination;

import java.util.List;

public interface ActivityService {

    void createActivities(Destination destination, List<ActivityRequest> requests);

    void syncActivities(Destination destination, List<ActivityRequest> requests);

}