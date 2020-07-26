package farm.vila;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class HomeController {

  @RequestMapping(value = { "/", "/submit", "/posts/*"})
  public String index(HttpServletRequest request, HttpServletResponse response) {
    // System.out.println("Serving malayalam index...");
    response.addHeader("cache-control", "no-cache");
    return "/index.html";
  }
}
