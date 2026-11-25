package com.example.BanckingAppBackend.Controller;

import com.example.BanckingAppBackend.Entity.DepositRequest;
import com.example.BanckingAppBackend.Repository.DepositRequestRepository;
import com.example.BanckingAppBackend.Repository.UserRepository;
import com.example.BanckingAppBackend.Entity.User;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/deposits")
@CrossOrigin(origins = "http://localhost:5173")
public class DepositRequestController {

    private final DepositRequestRepository depositRepo;
    private final UserRepository userRepo;

    public DepositRequestController(DepositRequestRepository depositRepo, UserRepository userRepo) {
        this.depositRepo = depositRepo;
        this.userRepo = userRepo;
    }

    @PostMapping("/request")
    public String requestDeposit(@RequestParam Long userId, @RequestParam BigDecimal amount) {
        DepositRequest req = new DepositRequest();
        req.setUserId(userId);
        req.setAmount(amount);
        depositRepo.save(req);
        return "✅ Deposit request sent to admin for approval.";
    }

    @GetMapping("/pending")
    public List<DepositRequest> getPendingRequests() {
        return depositRepo.findByStatus("PENDING");
    }

    @PutMapping("/approve/{id}")
    public String approveDeposit(@PathVariable Long id) {
        DepositRequest req = depositRepo.findById(id).orElseThrow();
        User user = userRepo.findById(req.getUserId()).orElseThrow();

        user.setBalance(user.getBalance().add(req.getAmount()));
        userRepo.save(user);

        req.setStatus("APPROVED");
        depositRepo.save(req);
        return "✅ Deposit approved successfully!";
    }

    @PutMapping("/reject/{id}")
    public String rejectDeposit(@PathVariable Long id) {
        DepositRequest req = depositRepo.findById(id).orElseThrow();
        req.setStatus("REJECTED");
        depositRepo.save(req);
        return "❌ Deposit request rejected.";
    }
}
