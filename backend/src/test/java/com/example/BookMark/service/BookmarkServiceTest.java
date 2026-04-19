package com.example.BookMark.service;

import com.example.BookMark.repository.BookmarkRepository;
import com.example.BookMark.repository.TagRepository;
import com.example.BookMark.entity.Bookmark;
import com.example.BookMark.entity.User;
import com.example.BookMark.entity.Tag;

import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.web.server.ResponseStatusException;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.mock;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.never;
import static org.assertj.core.api.Assertions.assertThat;
import org.mockito.junit.jupiter.MockitoExtension;

import java.nio.file.OpenOption;
import java.util.List;
import java.util.Optional;

@ExtendWith(MockitoExtension.class)
class BookmarkServiceTest {
    @Mock
    private BookmarkRepository bookmarkRepository;
    @Mock
    private TagRepository tagRepository;
    @InjectMocks
    private BookmarkService bookmarkService;

    @Test
    void test_getAll(){
        // Arrange
        User user = mock(User.class);
        when(user.getId()).thenReturn(1L);
        List<Bookmark> bookmarks = List.of(new Bookmark(), new Bookmark());
        when(bookmarkRepository.findByUserId(user.getId())).thenReturn(bookmarks);
        // Act
        List<Bookmark> result = bookmarkService.getAll(user);

        // Assert
        assertThat(result).isEqualTo(bookmarks);
    }

    @Test
    void test_create(){
        // Arrange
        User user = mock(User.class);
        Bookmark bookmark = mock(Bookmark.class);
        when(bookmarkRepository.save(any(Bookmark.class))).thenReturn(bookmark);
        // Act
        Bookmark result = bookmarkService.create(user, "https://gooaye.com", "Title", "Description");
        // Assert
        assertThat(result).isEqualTo(bookmark);
        verify(bookmarkRepository).save(any(Bookmark.class));
    }
    
    @Test
    void test_update_success(){
        // Arrange
        User user = mock(User.class);
        when(user.getId()).thenReturn(1L);
        Bookmark bookmark = new Bookmark();
        when(bookmarkRepository.findByIdAndUserId(1L, 1L)).thenReturn(Optional.of(bookmark));
        // Act
        Bookmark result = bookmarkService.update(user, 1L, "https://update.com", "updateTitle", "updateDescription");
        // Assert
        assertThat(result.getUrl()).isEqualTo("https://update.com");
        assertThat(result.getTitle()).isEqualTo("updateTitle");
        assertThat(result.getDescription()).isEqualTo("updateDescription");
    }

    @Test
    void test_update_notFound(){
        // Arrange
        User user = mock(User.class);
        when(user.getId()).thenReturn(1L);
        when(bookmarkRepository.findByIdAndUserId(1L, 1L)).thenReturn(Optional.empty());
        // Act
        assertThatThrownBy(() -> bookmarkService.update(user, 1L, "url", "title", "desc"))
        .isInstanceOf(ResponseStatusException.class)
        .hasMessageContaining("Bookmark not found !");
    }

    @Test
    void test_delete(){
        // Arrange
        User user = mock(User.class);
        when(user.getId()).thenReturn(1L);
        Bookmark bookmark = new Bookmark();
        when(bookmarkRepository.findByIdAndUserId(1L, 1L)).thenReturn(Optional.of(bookmark));
        // Act
        bookmarkService.delete(user, 1L);

        // Assert delete本身JPA的方法，接收entity物件本身
        verify(bookmarkRepository).delete(bookmark);
    }
    
    @Test
    void test_delete_notFound(){
        // Arrange
        User user = mock(User.class);
        when(user.getId()).thenReturn(1L);
        when(bookmarkRepository.findByIdAndUserId(1L, 1L)).thenReturn(Optional.empty());
        // Act
        assertThatThrownBy(() -> bookmarkService.delete(user, 1L))
        .isInstanceOf(ResponseStatusException.class)
        .hasMessageContaining("Bookmark not found !");
    }
    
    @Test
    void test_addTag_newTag(){
        // Arrange
        User user = mock(User.class);
        Bookmark bookmark = new Bookmark();
        when(user.getId()).thenReturn(1L);
        when(bookmarkRepository.findByIdAndUserId(1L, 1L)).thenReturn(Optional.of(bookmark));
        when(tagRepository.findByUserIdAndName(1L, "newTag")).thenReturn(Optional.empty());
        // Act
        bookmarkService.addTag(user, 1L, "newTag");
        // Assert
        verify(tagRepository).save(any(Tag.class));
    }

    @Test
    void test_addTag_existingTag(){
        // Arrange
        User user = mock(User.class);
        when(user.getId()).thenReturn(1L);
        Bookmark bookmark = new Bookmark();
        when(bookmarkRepository.findByIdAndUserId(1L, 1L)).thenReturn(Optional.of(bookmark));
        Tag existingTag = new Tag();
        when(tagRepository.findByUserIdAndName(1L, "existingTag")).thenReturn(Optional.of(existingTag));
        // Act
        bookmarkService.addTag(user, 1L, "existingTag");
        // Assert
        verify(tagRepository, never()).save(any());
    }
    
    @Test
    void test_removeTag_tagExisted(){
        // Arrange
        User user = mock(User.class);
        when(user.getId()).thenReturn(1L);
        Bookmark bookmark = mock(Bookmark.class);
        when(bookmarkRepository.findByIdAndUserId(1L, 1L)).thenReturn(Optional.of(bookmark));
        Tag existingTag = new Tag();
        when(tagRepository.findByUserIdAndName(1L, "existingTag")).thenReturn(Optional.of(existingTag));
        // Act
        bookmarkService.removeTag(user, 1L, "existingTag");
        // Assert
        verify(bookmark).removeTag(existingTag);
    }

    @Test
    void test_removeTag_tagNotFound(){
        // Arrange
        User user = mock(User.class);
        when(user.getId()).thenReturn(1L);
        Bookmark bookmark = mock(Bookmark.class);
        when(bookmarkRepository.findByIdAndUserId(1L, 1L)).thenReturn(Optional.of(bookmark));
        when(tagRepository.findByUserIdAndName(1L, "notexistingTag")).thenReturn(Optional.empty());
        // Act
        bookmarkService.removeTag(user, 1L, "notexistingTag");
        // Assert
        verify(bookmark, never()).removeTag(any());
    }
}
