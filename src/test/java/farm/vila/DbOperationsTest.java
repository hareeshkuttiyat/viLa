package farm.vila;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assertions.fail;

import java.util.List;
import java.util.UUID;

import com.azure.cosmos.CosmosContainer;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class DbOperationsTest {

  @BeforeAll
  public static void setUp() {
    System.setProperty("viLa.databaseName", "cosmos-viLa-test");
  }

  @Autowired
  private DbOperations dbOperations;

  @Test
  public void createContainerOK() {
    try {

      CosmosContainer container = dbOperations.createContainerIfNotExists("posts", "/district");

      assertNotNull(container);

    } catch (Exception e) {
      fail(e);
    }
  }

  @Test
  public void createPostOK() {
    try {
      // Given
      dbOperations.createContainerIfNotExists("posts", "/district");

      // When
      Post tPost = new Post();
      tPost.setId(UUID.randomUUID().toString());
      tPost.setPostId(Utils.generateRandomDigits(8));
      tPost.setCaption("Test caption at " + System.currentTimeMillis());
      tPost.setDetails("Some details");
      tPost.setDistrict("Kasaragod");

      int statusCode = dbOperations.createPost(tPost);

      // Then
      assertEquals(201, statusCode);

    } catch (Exception e) {
      fail(e);
    }
  }

  @Test
  public void listAllPosts() {
    try {

      //Given
      dbOperations.createContainerIfNotExists("posts", "/district");
      Post tPost = new Post();
      tPost.setId(UUID.randomUUID().toString());
      tPost.setPostId(Utils.generateRandomDigits(8));
      tPost.setCaption("Test caption at " + System.currentTimeMillis());
      tPost.setDetails("Some details");
      tPost.setDistrict("Kasaragod");

      dbOperations.createPost(tPost);

      //When
      List<Post> posts = dbOperations.listPosts("");

      //Then
      assertTrue(posts.size() >= 1);

    } catch (Exception e) {
      fail(e);
    }
  }

  @Test
  public void updatePostOK() {
    try {
      // Given
      dbOperations.createContainerIfNotExists("posts", "/district");

      Post post = new Post();
      post.setId(UUID.randomUUID().toString());
      post.setPostId(Utils.generateRandomDigits(8));
      post.setCaption("Test caption at " + System.currentTimeMillis());
      post.setDetails("Some details");
      post.setDistrict("Kasaragod");
      post.setPostKey(UUID.randomUUID().toString());
      dbOperations.createPost(post);

      // When
      Post updatedPost = post;
      updatedPost.setCaption("Another caption");

      int statusCode = dbOperations.replacePost(updatedPost);

      // Then
      assertEquals(200, statusCode);

      Post p = dbOperations.findPostByPostId(post.getPostId());
      assertEquals("Another caption", p.getCaption());

    } catch (Exception e) {
      fail(e);
    }
  }

  @Test
  public void updatePost_wrongPostKey_return401() {
    try {
      // Given
      dbOperations.createContainerIfNotExists("posts", "/district");

      Post post = new Post();
      post.setId(UUID.randomUUID().toString());
      post.setPostId(Utils.generateRandomDigits(8));
      post.setCaption("Test caption at " + System.currentTimeMillis());
      post.setDetails("Some details");
      post.setDistrict("Kannur");
      post.setPostKey(UUID.randomUUID().toString());
      dbOperations.createPost(post);

      // When
      Post updatedPost = post;
      updatedPost.setCaption("Another caption");
      updatedPost.setPostKey("invalid_key");

      int statusCode = dbOperations.replacePost(updatedPost);

      // Then
      assertEquals(401, statusCode);

    } catch (Exception e) {
      fail(e);
    }
  }

  @Test
  public void deletePost_wrongPostKey_return401() {
    try {
      // Given
      dbOperations.createContainerIfNotExists("posts", "/district");

      Post post = new Post();
      post.setId(UUID.randomUUID().toString());
      post.setPostId(Utils.generateRandomDigits(8));
      post.setCaption("Test caption at " + System.currentTimeMillis());
      post.setDetails("Some details");
      post.setDistrict("Kannur");
      post.setPostKey(UUID.randomUUID().toString());
      dbOperations.createPost(post);

      // When
      int statusCode = dbOperations.deletePost(post.getPostId(), "invalid_key");

      // Then
      assertEquals(401, statusCode);

    } catch (Exception e) {
      fail(e);
    }
  }

  @Test
  public void deletePostOK() {
    try {
      // Given
      dbOperations.createContainerIfNotExists("posts", "/district");

      Post post = new Post();
      post.setId(UUID.randomUUID().toString());
      post.setPostId(Utils.generateRandomDigits(8));
      post.setCaption("Test caption at " + System.currentTimeMillis());
      post.setDetails("Some details");
      post.setDistrict("Kannur");
      post.setPostKey(UUID.randomUUID().toString());
      dbOperations.createPost(post);

      // When
      int statusCode = dbOperations.deletePost(post.getPostId(), post.getPostKey());

      // Then
      assertEquals(204, statusCode);

    } catch (Exception e) {
      fail(e);
    }
  }

  // Disabled to avoid getting deleted each time when running other tests only
  // @Test
  public void deletePostsContainer() {
    try {
      //Given
      dbOperations.createContainerIfNotExists("posts", "/district");

      //When
      int statusCode = dbOperations.deletePostsContainer("secret");

      //Then
      assertEquals(204, statusCode);
    } catch (Exception e) {
      fail(e);
    }
  }
}
