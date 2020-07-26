package farm.vila;

import java.util.List;
import java.util.logging.Logger;
import java.util.stream.Collectors;

import com.azure.cosmos.ConsistencyLevel;
import com.azure.cosmos.CosmosClient;
import com.azure.cosmos.CosmosClientBuilder;
import com.azure.cosmos.CosmosContainer;
import com.azure.cosmos.CosmosDatabase;
import com.azure.cosmos.implementation.ConnectionPolicy;
import com.azure.cosmos.models.CosmosContainerProperties;
import com.azure.cosmos.models.CosmosContainerResponse;
import com.azure.cosmos.models.CosmosItemRequestOptions;
import com.azure.cosmos.models.CosmosItemResponse;
import com.azure.cosmos.models.CosmosQueryRequestOptions;
import com.azure.cosmos.models.PartitionKey;
import com.azure.cosmos.models.SqlParameter;
import com.azure.cosmos.models.SqlQuerySpec;
import com.azure.cosmos.util.CosmosPagedIterable;

import org.springframework.stereotype.Component;

@Component
public class DbOperations {

  private static Logger LOG = Logger.getLogger("o.v.DbOperations");

  private CosmosClient client;

  private String iDatabaseName = System.getProperty("viLa.databaseName", "cosmos-viLa");
  private String iAccountHost = System.getProperty("viLa.accountHost", "https://localhost:8081");
  private String iAccountKey = System.getProperty("viLa.accountKey", "C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw==");

  private static final String CONTAINER_NAME_POSTS = "posts";

  private CosmosDatabase database;

  /**
   *
   */
  public void close() {
    client.close();
  }

  /**
   *
   * @throws Exception
   */
  private void initialise() throws Exception {
    ConnectionPolicy defaultPolicy = ConnectionPolicy.getDefaultPolicy();
    defaultPolicy.setUserAgentSuffix("viLaApp");

    // Create sync client
    client = new CosmosClientBuilder()
                .endpoint(iAccountHost)
                .key(iAccountKey)
                .directMode()
                .consistencyLevel(ConsistencyLevel.EVENTUAL)
                .buildClient();

    client.createDatabaseIfNotExists(iDatabaseName);
    database = client.getDatabase(iDatabaseName);
  }

  /**
   *
   * @param containerName
   * @param partitionKeyPath
   * @return
   * @throws Exception
   */
  CosmosContainer createContainerIfNotExists(String containerName, String partitionKeyPath) throws Exception {
    LOG.fine("Create container " + containerName + " if not exists.");

    // Hopefullly safe lazy instantiation (oh yeah)
    if (client == null) {
      synchronized(this) {
        initialise();
      }
    }

    // Create container if not exists
    CosmosContainerProperties containerProperties = new CosmosContainerProperties(containerName, partitionKeyPath);

    // Create container with 400 RU/s
    database.createContainerIfNotExists(containerProperties);
    CosmosContainer tContainer = database.getContainer(containerName);

    LOG.fine("Checking container " + tContainer.getId() + " completed!\n");

    return tContainer;
  }

  // private void scaleContainer(String containerName) throws Exception {
  //   System.out.println("Scale container " + containerName + " to 500 RU/s.");

  //   // You can scale the throughput (RU/s) of your container up and down to meet the
  //   // needs of the workload. Learn more: https://aka.ms/cosmos-request-units
  //   CosmosContainer tContainer = database.getContainer(containerName);
  //   int currentThroughput = tContainer.readProvisionedThroughput();
  //   currentThroughput = currentThroughput + 100;
  //   tContainer.replaceProvisionedThroughput(currentThroughput);
  //   System.out.println("Scaled container to " + currentThroughput + " completed!\n");
  // }

  /**
   *
   */
  public int createPost(Post post) throws Exception {

    CosmosContainer postsContainer = createContainerIfNotExists(CONTAINER_NAME_POSTS, "/district");

    CosmosItemRequestOptions cosmosItemRequestOptions = new CosmosItemRequestOptions();
    CosmosItemResponse<Post> createdResponse = postsContainer.createItem(post, new PartitionKey(post.getDistrict()), cosmosItemRequestOptions);

    return createdResponse.getStatusCode();
  }

  /**
   *
   * @param postId
   * @return
   * @throws Exception
   */
  public Post findPostByPostId(int postId) throws Exception {
    CosmosContainer postsContainer = createContainerIfNotExists(CONTAINER_NAME_POSTS, "/district");

    String sql = "SELECT * FROM c WHERE c.postId = @post_id";

    SqlParameter[] params = new SqlParameter[]{ new SqlParameter("@post_id", postId)};
    SqlQuerySpec sqs = new SqlQuerySpec(sql, params);

    CosmosPagedIterable<Post> filteredPosts = postsContainer.queryItems(sqs, new CosmosQueryRequestOptions(), Post.class);
    Post post = null;
    if (filteredPosts.iterator().hasNext()) {
      post = filteredPosts.iterator().next();
      post.setId("");
      post.setPostKey("");
    }

    return post;
  }

  /**
   *
   * @param updatedPost
   * @return
   * @throws Exception
   */
  public int replacePost(Post updatedPost) throws Exception {
    CosmosContainer postsContainer = createContainerIfNotExists(CONTAINER_NAME_POSTS, "/district");

    String sql = "SELECT * FROM c WHERE c.postId = @post_id AND c.postKey = @api_key";

    SqlParameter[] params = new SqlParameter[]{ new SqlParameter("@post_id", updatedPost.getPostId()), new SqlParameter("@api_key", updatedPost.getPostKey())};
    SqlQuerySpec sqs = new SqlQuerySpec(sql, params);

    CosmosPagedIterable<Post> filteredPosts = postsContainer.queryItems(sqs, new CosmosQueryRequestOptions(), Post.class);
    Post post = null;
    if (filteredPosts.iterator().hasNext()) {
      post = filteredPosts.iterator().next();
    }
    // Provided api key is not the owner of this post
    if (post == null) {
      return 401;
    }
    updatedPost.setId(post.getId());
    updatedPost.setPostedDate(post.getPostedDate());
    CosmosItemResponse<Post> updatedResponse = postsContainer.replaceItem(updatedPost, post.getId(), new PartitionKey(updatedPost.getDistrict()), new CosmosItemRequestOptions());
    return updatedResponse.getStatusCode();
  }

  /**
   *
   * @param deletedPost
   * @return
   * @throws Exception
   */
  public int deletePost(int postId, String postKey) throws Exception {
    CosmosContainer postsContainer = createContainerIfNotExists(CONTAINER_NAME_POSTS, "/district");

    String sql = "SELECT * FROM c WHERE c.postId = @post_id AND c.postKey = @api_key";

    SqlParameter[] params = new SqlParameter[]{ new SqlParameter("@post_id", postId), new SqlParameter("@api_key", postKey)};
    SqlQuerySpec sqs = new SqlQuerySpec(sql, params);

    CosmosPagedIterable<Post> filteredPosts = postsContainer.queryItems(sqs, new CosmosQueryRequestOptions(), Post.class);
    Post post = null;
    if (filteredPosts.iterator().hasNext()) {
      post = filteredPosts.iterator().next();
    }
    // Provided api key is not the owner of this post
    if (post == null) {
      return 401;
    }
    CosmosItemResponse<Object> deletedResponse = postsContainer.deleteItem(post.getId(), new PartitionKey(post.getDistrict()), new CosmosItemRequestOptions());
    return deletedResponse.getStatusCode();
  }

  /**
   *
   * @param aSearch
   * @return
   * @throws Exception
   */
  public List<Post> listPosts(String aSearch) throws Exception {

    CosmosContainer postsContainer = createContainerIfNotExists(CONTAINER_NAME_POSTS, "/district");

    // FeedOptions queryOptions = new FeedOptions();
    // queryOptions.setMaxBufferedItemCount(10);
    // queryOptions.setScanInQueryEnabled(true);
    // // Set populate query metrics to get metrics around query executions
    // queryOptions.setPopulateQueryMetrics(true);

    String sql = "SELECT * FROM c WHERE (CONTAINS(LOWER(c.caption), LOWER(@caption_text)) OR CONTAINS(LOWER(c.details), LOWER(@caption_text))) AND c.status = 'Active' ORDER BY c.postedDate DESC";
    if (aSearch == null || aSearch.isEmpty()) {
      sql = "SELECT * FROM c WHERE c.status = 'Active' ORDER BY c.postedDate DESC";
    }


    SqlParameter[] params = new SqlParameter[]{ new SqlParameter("@caption_text", aSearch)};
    SqlQuerySpec sqs = new SqlQuerySpec(sql, params);

    CosmosPagedIterable<Post> filteredPosts = postsContainer.queryItems(sqs, new CosmosQueryRequestOptions(), Post.class);
        // Print
    List<Post> posts = filteredPosts.stream().map(temp -> {
      Post obj = new Post();
      obj.setPostId(temp.getPostId());
      obj.setCaption(temp.getCaption());
      if (temp.getDetails() != null) {
        obj.setDetails(temp.getDetails().substring(0, Math.min(temp.getDetails().length(), 99)));
      }
      obj.setPostedDate(temp.getPostedDate());
      obj.setPostType(temp.getPostType());
      obj.setDistrict(temp.getDistrict());
      obj.setPhoneNumber(temp.getPhoneNumber());
      return obj;
    }).collect(Collectors.toList());

    return posts;
  }

  /**
   *
   * @return
   * @throws Exception
   */
  public int deletePostsContainer(String key) throws Exception {
    //This is a high risk operation and needs protection from accidentally being called on production database
    if (key != "secret") {
      return 401;
    }
    if (client == null) {
      synchronized(this) {
        initialise();
      }
    }
    CosmosContainer postsContainer = database.getContainer(CONTAINER_NAME_POSTS);

    //TODO Fix: Calling delete hangs if the container does not exist already
    CosmosContainerResponse deletedResponse = postsContainer.delete();

    return deletedResponse.getStatusCode();
  }

}
