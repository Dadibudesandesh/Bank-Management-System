package com.example.BanckingAppBackend.Service;

import com.example.BanckingAppBackend.Entity.Transaction;
import com.example.BanckingAppBackend.Entity.User;
import com.example.BanckingAppBackend.Repository.TransactionRepository;
import com.example.BanckingAppBackend.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class TransactionService {

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Transaction> getAllTransactions() {
        return transactionRepository.findAll();
    }

    public List<Transaction> getTransactionsByAccount(String accountNumber) {
        return transactionRepository.findByFromAccountOrToAccount(accountNumber, accountNumber);
    }

    public String deposit(String accountNumber, double amount) {
        User user = userRepository.findByAccountNumber(accountNumber);
        if (user == null) return "❌ Account not found.";

        user.setBalance(user.getBalance().add(BigDecimal.valueOf(amount)));
        userRepository.save(user);

        Transaction tx = new Transaction(
                null,
                "DEPOSIT",
                BigDecimal.valueOf(amount),
                "BANK",
                accountNumber,
                LocalDateTime.now(),
                "SUCCESS"
        );
        transactionRepository.save(tx);

        return "✅ Deposit successful. ₹" + amount + " added to account " + accountNumber;
    }

    public String withdraw(String accountNumber, double amount) {
        User user = userRepository.findByAccountNumber(accountNumber);
        if (user == null) return "❌ Account not found.";
        if (user.getBalance().compareTo(BigDecimal.valueOf(amount)) < 0)
            return "⚠️ Insufficient balance.";

        user.setBalance(user.getBalance().subtract(BigDecimal.valueOf(amount)));
        userRepository.save(user);

        Transaction tx = new Transaction(
                null,
                "WITHDRAW",
                BigDecimal.valueOf(amount),
                accountNumber,
                "BANK",
                LocalDateTime.now(),
                "SUCCESS"
        );
        transactionRepository.save(tx);

        return "✅ Withdrawal successful. ₹" + amount + " deducted from account " + accountNumber;
    }

    public String transfer(String fromAccount, String toAccount, double amount) {
        if (fromAccount.equals(toAccount)) return "❌ Cannot transfer to the same account.";

        User sender = userRepository.findByAccountNumber(fromAccount);
        User receiver = userRepository.findByAccountNumber(toAccount);

        if (sender == null || receiver == null) return "❌ Invalid account details.";
        if (sender.getBalance().compareTo(BigDecimal.valueOf(amount)) < 0)
            return "⚠️ Insufficient balance.";

        sender.setBalance(sender.getBalance().subtract(BigDecimal.valueOf(amount)));
        receiver.setBalance(receiver.getBalance().add(BigDecimal.valueOf(amount)));

        userRepository.save(sender);
        userRepository.save(receiver);

        Transaction tx = new Transaction(
                null,
                "TRANSFER",
                BigDecimal.valueOf(amount),
                fromAccount,
                toAccount,
                LocalDateTime.now(),
                "SUCCESS"
        );
        transactionRepository.save(tx);

        return "✅ Transfer successful! ₹" + amount + " sent from " + fromAccount + " to " + toAccount;
    }

}
