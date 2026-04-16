package com.example.BookMark.controller;

import com.example.BookMark.dto.BookmarkRequest;
import com.example.BookMark.dto.BookmarkResponse;
import com.example.BookMark.dto.TagRequest;
import com.example.BookMark.entity.Bookmark;
import com.example.BookMark.entity.User;
import com.example.BookMark.service.BookmarkService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// Restcontroller can automatically convert return value into JSON
@RestController
@RequestMapping("/api/bookmarks")
@RequiredArgsConstructor
public class BookmarkController {
    private final BookmarkService bookmarkService;
    @GetMapping
    public List<BookmarkResponse> getAll(@AuthenticationPrincipal User user){
        return bookmarkService.getAll(user).stream().map(BookmarkResponse::new).toList();
    }

    @PostMapping
    public ResponseEntity<BookmarkResponse> create(@AuthenticationPrincipal User user, @Valid @RequestBody BookmarkRequest request){
        Bookmark bookmark = bookmarkService.create(user, request.getUrl(), request.getTitle(), request.getDescription());
        return ResponseEntity.status(HttpStatus.CREATED).body(new BookmarkResponse(bookmark));
    }

    @PutMapping("{id}")
    public BookmarkResponse update(@AuthenticationPrincipal User user, @PathVariable Long id, @Valid @RequestBody BookmarkRequest request){
        Bookmark bookmark = bookmarkService.update(user, id, request.getUrl(), request.getTitle(), request.getDescription());
        return new BookmarkResponse(bookmark);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@AuthenticationPrincipal User user, @PathVariable Long id){
        bookmarkService.delete(user, id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/tags")
    public BookmarkResponse addTag(@AuthenticationPrincipal User user, @PathVariable Long id, @Valid @RequestBody TagRequest request){
        Bookmark bookmark = bookmarkService.addTag(user, id, request.getName());
        return new BookmarkResponse(bookmark);
    }

    @DeleteMapping("/{id}/tags/{tagName}")
    public BookmarkResponse removeTag(@AuthenticationPrincipal User user, @PathVariable Long id, @PathVariable String tagName){
        Bookmark bookmark = bookmarkService.removeTag(user, id, tagName);
        return new BookmarkResponse(bookmark);

    }
    
}
