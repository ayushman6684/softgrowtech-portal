package com.softgrowtech.repository;

import com.softgrowtech.model.Submission;
import com.softgrowtech.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SubmissionRepository extends JpaRepository<Submission, Long> {
    List<Submission> findByInternOrderBySubmittedAtDesc(User intern);
    List<Submission> findByStatusOrderBySubmittedAtDesc(Submission.Status status);
    List<Submission> findAllByOrderBySubmittedAtDesc();
    long countByStatus(Submission.Status status);

    @Query("SELECT s FROM Submission s WHERE " +
           "(:domain IS NULL OR s.intern.domain = :domain) AND " +
           "(:status IS NULL OR s.status = :status)")
    List<Submission> findByFilters(String domain, Submission.Status status);
}
