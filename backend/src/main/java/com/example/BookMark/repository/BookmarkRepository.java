package com.example.BookMark.repository;

import com.example.BookMark.entity.Bookmark;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;;

public interface BookmarkRepository extends JpaRepository<Bookmark, Long>{
    // Over-fetching的問題，規模大的專案可能會影響效能，因為他強制載入所有Tags
    @EntityGraph(attributePaths = "tags")
    List<Bookmark> findByUserId(Long userId);
    @EntityGraph(attributePaths = "tags")
    Optional<Bookmark> findByIdAndUserId(Long id, Long userId);
}