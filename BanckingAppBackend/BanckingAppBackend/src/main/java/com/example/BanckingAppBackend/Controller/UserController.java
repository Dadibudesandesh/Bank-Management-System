package com.example.BanckingAppBackend.Controller;

import com.example.BanckingAppBackend.Entity.Transaction;
import com.example.BanckingAppBackend.Entity.User;
import com.example.BanckingAppBackend.Repository.TransactionRepository;
import com.example.BanckingAppBackend.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.BanckingAppBackend.dto.LoginResponse;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    @Autowired
    UserService userService;

    @Autowired
    TransactionRepository transactionRepository;

    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/users")
    public List<User> getUsers() {
        return userService.getUsers();
    }

    @GetMapping("/{id}")
    public User getUserById(@PathVariable long id) {
        return userService.getUserById(id);
    }

    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody User user) {
        String message = userService.registerUser(user);
        if (message.contains("exists")) return ResponseEntity.badRequest().body(message);
        return ResponseEntity.ok(message);
    }

    @PutMapping("/{id}")
    public User updateUser(@RequestBody User user, @PathVariable Long id) {
        return userService.updateUser(user, id);
    }

    @DeleteMapping("/{id}")
    public User deleteUser(@PathVariable long id) {
        return userService.deleteUser(id);
    }


//    @PostMapping("/login")
//    public ResponseEntity<String> login(@RequestBody User loginReq) {
//        String result = userService.loginUser(loginReq.getEmail(), loginReq.getPassword());
//        if (result.equals("Login successful")) return ResponseEntity.ok(result);
//        return ResponseEntity.badRequest().body(result);
//    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User loginReq) {

        try {
            LoginResponse response = userService.loginUser(
                    loginReq.getEmail(),
                    loginReq.getPassword()
            );

            return ResponseEntity.ok(response);

        } catch (org.springframework.security.core.AuthenticationException ex) {
            return ResponseEntity.status(401)
                    .body(Map.of("message", "Invalid credentials or account not approved"));
        }
    }

    
    @GetMapping("/email/{email}")
    public User getUserByEmail(@PathVariable String email) {
        return userService.getUserByEmail(email);
    }

    @GetMapping("/user/{userId}/latest")
    public List<Transaction> getLatestTransactions(@PathVariable Long userId) {
        var user = userService.findById(userId).orElse(null);
        if (user==null){
            return List.of();
        }

        return transactionRepository.findTop5ByFromAccountOrToAccountOrderByTimestampDesc(
                user.getAccountNumber(),
                user.getAccountNumber()
        );
    }

    @GetMapping("/account/{accNo}")
    public User getUserByAccountNo(@PathVariable String accNo){
        return userService.getUserByAccountNo(accNo);
    }

    @GetMapping("/test")
    public String test() {
        return "UserController is working!";
    }
}
