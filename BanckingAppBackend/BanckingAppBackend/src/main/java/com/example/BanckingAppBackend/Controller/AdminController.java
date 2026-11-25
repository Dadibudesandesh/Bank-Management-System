package com.example.BanckingAppBackend.Controller;

import com.example.BanckingAppBackend.Entity.Transaction;
import com.example.BanckingAppBackend.Entity.User;
import com.example.BanckingAppBackend.Repository.TransactionRepository;
import com.example.BanckingAppBackend.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @GetMapping("/pendingUsers")
    public List<User> getPendingUsers() {
        return userRepository.findByStatus("PENDING");
    }

    @PutMapping("/approve/{id}")
    public ResponseEntity<String> approveUser(@PathVariable Long id) {
        User user = userRepository.findById(id).orElse(null);
        if (user == null) return ResponseEntity.badRequest().body("User not found");

        user.setStatus("APPROVED");
        userRepository.save(user);
        return ResponseEntity.ok("User approved successfully!");
    }

    @PutMapping("/reject/{id}")
    public ResponseEntity<String> rejectUser(@PathVariable Long id) {
        User user = userRepository.findById(id).orElse(null);
        if (user == null) return ResponseEntity.badRequest().body("User not found");

        user.setStatus("REJECTED");
        userRepository.save(user);
        return ResponseEntity.ok("User rejected!");
    }

    @GetMapping("/summary")
    public Map<String, Object> getSummary() {
        Map<String, Object> summary = new HashMap<>();

        BigDecimal totalCash = userRepository.findByStatus("APPROVED").stream()
                .map(User::getBalance)
                .filter(Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalWithdrawal = transactionRepository.findByTransactionType("WITHDRAW").stream()
                .map(Transaction::getAmount)
                .filter(Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalDeposit = transactionRepository.findByTransactionType("DEPOSIT").stream()
                .map(Transaction::getAmount)
                .filter(Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        summary.put("totalCash", totalCash);
        summary.put("totalWithdrawal", totalWithdrawal);
        summary.put("totalDeposit", totalDeposit);
        summary.put("totalAccounts", userRepository.findByStatus("APPROVED").size());
        summary.put("totalUsers", userRepository.findByStatus("APPROVED").size());
        summary.put("pendingUsers", userRepository.findByStatus("PENDING").size());

        return summary;
    }





}
