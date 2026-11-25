package com.example.BanckingAppBackend.Repository;

import com.example.BanckingAppBackend.Entity.DepositRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DepositRequestRepository extends JpaRepository<DepositRequest, Long> {
    List<DepositRequest> findByStatus(String status);
}
