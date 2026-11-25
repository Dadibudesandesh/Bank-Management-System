package com.example.BanckingAppBackend.Repository;

import com.example.BanckingAppBackend.Entity.User;
import jakarta.persistence.Id;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User,Long> {
    @Query("SELECT MAX(u.accountNumber) FROM User u")
    Long findMaxAccountNumber();
    User findByEmail(String email);
    List<User> findByStatus(String status);

    User findByAccountNumber(String fromAccount);

//    List<User> findByRole(String user);

    List<User> findByRoleAndStatus(String user, String approve);

}
