
package com.alloc8.backend.repository;

import com.alloc8.backend.entity.AllocationRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AllocationRequestRepository
        extends JpaRepository<AllocationRequest, Long> {

    List<AllocationRequest> findAllByStatusOrderByPriorityDesc(
            String status);
}
