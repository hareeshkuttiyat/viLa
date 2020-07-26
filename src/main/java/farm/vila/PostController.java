package farm.vila;

import java.util.Date;
import java.util.List;
import java.util.UUID;
import java.util.logging.Logger;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.IanaLinkRelations;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
class PostController {
  private static Logger LOG = Logger.getLogger("o.v.PostController");

  @Autowired
  private DbOperations dbOperations;

  private PostModelAssembler assembler;

  PostController(DbOperations dbOperations, PostModelAssembler assembler) {

    this.dbOperations = dbOperations;
    this.assembler = assembler;
  }

  /**
   *
   * @param newPost
   * @return
   * @throws Exception
   */
  @PostMapping("/api/posts")
  public ResponseEntity<EntityModel<Post>> createPost(@RequestBody Post newPost) throws Exception {

    LOG.fine(newPost != null ? "newPost: " + newPost.getCaption() : "newPost is null");

    newPost.setId(UUID.randomUUID().toString());
    newPost.setPostId(Utils.generateRandomDigits(8));
    if (newPost.getDistrict() == null || newPost.getDistrict().isEmpty()) {
      newPost.setDistrict("All_Kerala");
    }
    newPost.setStatus("Active");
    newPost.setPostKey(UUID.randomUUID().toString());
    newPost.setPostedDate(new Date());
    newPost.setLastUpdated(newPost.getPostedDate());

    dbOperations.createPost(newPost);

    //Avoid leaking internal id and api key
    newPost.setId("");

    EntityModel<Post> entityModel = assembler.toModel(newPost);

    return ResponseEntity.created(entityModel.getRequiredLink(IanaLinkRelations.SELF).toUri()).body(entityModel);
  }

  @PutMapping("/api/posts/{postId}")
  public ResponseEntity<Object> updatePost(@RequestBody Post updatedPost) throws Exception {

    LOG.fine(updatedPost != null ? "updatedPost: " + updatedPost.getCaption() : "updatedPost is null");

    if (updatedPost.getDistrict() == null || updatedPost.getDistrict().isEmpty()) {
      updatedPost.setDistrict("All_Kerala");
    }
    updatedPost.setLastUpdated(new Date());

    int statusCode = dbOperations.replacePost(updatedPost);
    if (statusCode == 401) {
      ErrorMessage error = new ErrorMessage(401, "The api key supplied is not authorised to update this post");
      return ResponseEntity.status(401).body(error);
    }

    //Avoid leaking internal id and api key
    updatedPost.setId("");
    updatedPost.setPostKey("");

    EntityModel<Post> entityModel = assembler.toModel(updatedPost);

    return ResponseEntity.ok().body(entityModel);
  }

  /**
   *
   * @param postId
   * @param postKey
   * @return
   * @throws Exception
   */
  @DeleteMapping("/api/posts/{postId}")
  int delete(@PathVariable int postId, @RequestHeader("postKey") String postKey) throws Exception {

    return dbOperations.deletePost(postId, postKey);
  }

  /**
   *
   * @param postId
   * @return
   * @throws Exception
   */
  @GetMapping("/api/posts/{postId}")
  EntityModel<Post> one(@PathVariable int postId) throws Exception {

    Post post = dbOperations.findPostByPostId(postId);

    return assembler.toModel(post);
  }

  /**
   *
   * @param aSearch
   * @return
   * @throws Exception
   */
  @GetMapping("/api/posts")
  CollectionModel<EntityModel<Post>> all(@RequestParam(required = false, name = "q") String aSearch) throws Exception {

    List<EntityModel<Post>> posts = dbOperations.listPosts(aSearch).stream().map(assembler::toModel)
        .collect(Collectors.toList());
    return new CollectionModel<EntityModel<Post>>(posts);//, linkTo(methodOn(PostController.class).all()).withSelfRel());
  }
}
