package farm.vila;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

import java.util.Arrays;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.hateoas.EntityModel;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;


@WebMvcTest(PostController.class)
public class PostControllerTest {

  @Autowired
  private MockMvc mvc;

  @MockBean
  private DbOperations dbOperations;

  @MockBean
  private PostModelAssembler postModelAssembler;

  @BeforeEach
  public void setUp() {

    Post p1 = new Post();
    p1.setPostId(1);
    p1.setCaption("capt");

    try {
      Mockito.when(postModelAssembler.toModel(p1)).thenReturn(new EntityModel<>(p1,
        linkTo(methodOn(PostController.class).one(p1.getPostId())).withSelfRel(),
        linkTo(methodOn(PostController.class).all("")).withRel("posts")));

      Mockito.when(dbOperations.listPosts("")).thenReturn(Arrays.asList(p1));
    } catch (Exception e) {
      e.printStackTrace();
    }
  }

  @Test
  public void givenPosts_whenGetPosts_thenReturnJsonArray() throws Exception {

    // Post p1 = new Post();
    // p1.setPostId(1);

    // List<Post> allPosts = Arrays.asList(p1);

    // given(dbOperations.listPosts("")).willReturn(allPosts);

    mvc.perform(MockMvcRequestBuilders.get("/api/posts?q=")
      .contentType(MediaType.APPLICATION_JSON))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$._embedded.postList", hasSize(1)))
      .andExpect(jsonPath("$._embedded.postList[0].caption", is("capt")));
  }

}
