package com.example.BanckingAppBackend.Service;

import com.example.BanckingAppBackend.Entity.User;
import com.example.BanckingAppBackend.Repository.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import com.example.BanckingAppBackend.util.JwtUtil;
import com.example.BanckingAppBackend.dto.LoginResponse;
@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, AuthenticationManager authenticationManager, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(long id) {
        return userRepository.findById(id).orElseThrow(()->new RuntimeException("User Not Found"));
    }

    public String registerUser(User user) {
        Long maxAcc=userRepository.findMaxAccountNumber();
        if (maxAcc==null){
            maxAcc=10001L;
        }else {
            maxAcc++;
        }
        if (userRepository.findByEmail(user.getEmail()) != null) {
            return "Email already exists!";
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole("USER");
        user.setStatus("PENDING");
        user.setBalance(BigDecimal.valueOf(500.00));
        user.setAccountNumber(maxAcc.toString());

        userRepository.save(user);
        return "Registration submitted for admin approval.";
    }


//    public String loginUser(String email, String password) {
//
//        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email,password));
////        User user = userRepository.findByEmail(email);
////        if (user == null) return "User not found";
////        if (!user.getPassword().equals(password)) return "Invalid password";
////        if (!"APPROVED".equals(user.getStatus())) return "Account not yet approved";
//        return "Login successful";
//    }
public LoginResponse loginUser(String email, String password) {

    // Step 1: Authenticate user credentials
    authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(email, password)
    );

    // Step 2: Fetch authenticated user
    User user = userRepository.findByEmail(email);

    // Step 3: Generate JWT
    String token = jwtUtil.generateToken(user.getEmail());

    // Step 4: Return token and safe user details
    return new LoginResponse(
            token,
            "Bearer",
            user.getId(),
            user.getEmail(),
            user.getRole(),
            user.getFullName()
    );
}

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }


    public User updateUser(User user, long id) {
        User newUser=userRepository.findById(id).orElseThrow(()->new RuntimeException("User Not found"));
        newUser.setGender(user.getGender());
        newUser.setEmail(user.getEmail());
        newUser.setFname(user.getFname());
        newUser.setMname(user.getMname());
        newUser.setLname(user.getLname());
        newUser.setContactNo(user.getContactNo());
        newUser.setPassword(user.getPassword());
        newUser.setBalance(user.getBalance());
        return userRepository.save(newUser);
    }

    public User deleteUser(long id) {
        User deletedUser =userRepository.findById(id).orElseThrow(()->new RuntimeException("User Not found"));
        userRepository.deleteById(id);
        return deletedUser;
    }


    public User getUserByAccountNo(String accNo) {
        return userRepository.findByAccountNumber(accNo);
    }

    public Optional<User> findById(Long userId) {
        return userRepository.findById(userId);
    }

    public List<User> getUsers() {
        return userRepository.findByRoleAndStatus("USER","APPROVED");
    }
}
