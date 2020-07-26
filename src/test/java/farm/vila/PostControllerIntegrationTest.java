package farm.vila;

import static org.hamcrest.Matchers.greaterThanOrEqualTo;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.equalTo;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;

import java.util.UUID;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectWriter;
import com.fasterxml.jackson.databind.SerializationFeature;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;


@SpringBootTest( webEnvironment = SpringBootTest.WebEnvironment.MOCK, classes = Application.class)
@AutoConfigureMockMvc
public class PostControllerIntegrationTest {

  @Autowired
  private MockMvc mvc;

  @Autowired
  private DbOperations dbOperations;

  @BeforeAll
  public static void setUp() {
    System.setProperty("viLa.databaseName", "cosmos-viLa-test");
  }

  @Test
  public void givenPost_whenGetPosts_thenStatus200() throws Exception {

    // dbOperations.deletePostsContainer();

    Post p1 = new Post();
    p1.setId(UUID.randomUUID().toString());
    p1.setPostId(Utils.generateRandomDigits(8));
    p1.setCaption("ജൈവ" + p1.getPostId());
    p1.setPostKey(UUID.randomUUID().toString());
    p1.setDistrict("some_dist");

    dbOperations.createPost(p1);

    mvc.perform(MockMvcRequestBuilders.get("/api/posts?q=")
      .contentType(MediaType.APPLICATION_JSON))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$._embedded.postList", hasSize(greaterThanOrEqualTo(1))))
      .andExpect(jsonPath("$._embedded.postList[?(@.caption=='ജൈവ" + p1.getPostId() + "')]").exists());
  }

  @Test
  public void givenPost_whenUpdatePost_thenStatus200() throws Exception {

    Post p1 = new Post();
    p1.setId(UUID.randomUUID().toString());
    p1.setPostId(Utils.generateRandomDigits(8));
    p1.setCaption("capt" + p1.getPostId());
    p1.setPostKey(UUID.randomUUID().toString());
    p1.setDistrict("some_dist");
    dbOperations.createPost(p1);

    Post p = dbOperations.findPostByPostId(p1.getPostId());

    Post p2 = new Post();
    p2.setPostId(p1.getPostId());
    p2.setCaption("new capt" + p1.getPostId());
    p2.setPostKey(p.getPostKey());
    p2.setDistrict(p1.getDistrict());

    ObjectMapper mapper = new ObjectMapper();
    mapper.configure(SerializationFeature.WRAP_ROOT_VALUE, false);
    ObjectWriter ow = mapper.writer().withDefaultPrettyPrinter();
    String requestJson = ow.writeValueAsString(p2);

    mvc.perform(MockMvcRequestBuilders.put("/api/posts/" + p1.getPostId()).content(requestJson)
      .contentType(MediaType.APPLICATION_JSON))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.caption", equalTo(p2.getCaption())));
  }
}
