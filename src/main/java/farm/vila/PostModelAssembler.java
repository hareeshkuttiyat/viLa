package farm.vila;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

import java.util.logging.Level;
import java.util.logging.Logger;

import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.server.RepresentationModelAssembler;
import org.springframework.stereotype.Component;

@Component
public class PostModelAssembler implements RepresentationModelAssembler<Post, EntityModel<Post>> {
  private static Logger LOG = Logger.getLogger("o.v.PostModelAssembler");

  @Override
  public EntityModel<Post> toModel(Post post) {

    try {
      return new EntityModel<>(post,
        linkTo(methodOn(PostController.class).one(post.getPostId())).withSelfRel(),
        linkTo(methodOn(PostController.class).all("")).withRel("posts"));
    } catch (Exception e) {
      LOG.log(Level.SEVERE, "Error in mapping to entity model", e);
      return null; //TODO What happens when null is returned?
    } // Link to post list without query parameters
  }
}
