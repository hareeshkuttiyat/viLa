package online.vila;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class VilaController {

  @RequestMapping("/posts")
  public String createPost() {
    return "Created";
  }
}
