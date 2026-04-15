package com.example.BookMark.service;

import com.example.BookMark.entity.Bookmark;
import com.example.BookMark.entity.Tag;
import com.example.BookMark.entity.User;
import com.example.BookMark.repository.BookmarkRepository;
import com.example.BookMark.repository.TagRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class BookmarkService {
    private final BookmarkRepository bookmarkRepository;
    private final TagRepository tagRepository;
    // getAll bookmarks of this user
    public List<Bookmark> getAll(User user){
        return bookmarkRepository.findByUserId(user.getId());
    }
    
    // create a new tag and belong to this user
    public Bookmark create(User user, String url, String title, String description){
        Bookmark bookmark = new Bookmark();
        bookmark.setUser(user);
        bookmark.setUrl(url);
        bookmark.setTitle(title);
        bookmark.setDescription(description);
        return bookmarkRepository.save(bookmark);
    }
    public Bookmark update(User user, Long bookmarkId, String url, String title, String description){
        // make sure this tag belongs to this user
        Bookmark bookmark = getOwnedBookmark(user, bookmarkId);
        bookmark.setUrl(url);
        bookmark.setTitle(title);
        bookmark.setDescription(description);
        return bookmark;
    }
    public void delete(User user, Long bookmarkId){
        // make sure this tag belongs to this user
        Bookmark bookmark = getOwnedBookmark(user, bookmarkId);
        bookmarkRepository.delete(bookmark);
    }
    
    public Bookmark addTag(User user, Long bookmarkId, String tagName){
        Bookmark bookmark = getOwnedBookmark(user, bookmarkId);
        Tag tag = tagRepository.findByUserIdAndName(user.getId(), tagName).orElseGet(() -> {
            Tag newTag = new Tag();
            newTag.setUser(user);
            newTag.setName(tagName);
            return tagRepository.save(newTag);
        });
        bookmark.addTag(tag);
        return bookmark;
    }

    public Bookmark removeTag(User user, Long bookmarkId, String tagName){
        Bookmark bookmark = getOwnedBookmark(user, bookmarkId);
        tagRepository.findByUserIdAndName(user.getId(), tagName).ifPresent(tag -> bookmark.removeTag(tag));
        return bookmark;
    }

    // private helper: make sure the tag belong to the user
    private Bookmark getOwnedBookmark(User user, Long bookmarkId){
        return bookmarkRepository.findByIdAndUserId(bookmarkId, user.getId()).orElseThrow(() -> 
            new ResponseStatusException(HttpStatus.NOT_FOUND, "Bookmark not found !"));
    }
    
}
