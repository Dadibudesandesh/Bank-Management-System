package com.example.BanckingAppBackend.Repository;

import com.example.BanckingAppBackend.Entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Arrays;
import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByFromAccountOrToAccount(String fromAccount, String toAccount);
    List<Transaction> findTop5ByFromAccountOrToAccountOrderByTimestampDesc(String fromAccount, String toAccount);

    List<Transaction> findByTransactionType(String transactionType);
}
