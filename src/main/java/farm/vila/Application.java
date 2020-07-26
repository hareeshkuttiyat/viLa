package farm.vila;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class Application {

	public static void main(final String[] args) {
		SpringApplication.run(Application.class, args);
  }

  // @Bean
	// public WebMvcConfigurer corsConfigurer() {
	// 	return new WebMvcConfigurer() {
	// 		@Override
	// 		public void addCorsMappings(CorsRegistry registry) {
  //       registry.addMapping("/api/*").allowedOrigins("http://localhost:4200");
  //       registry.addMapping("/api/*").allowedOrigins("https://vila.azurewebsites.net");
  //       registry.addMapping("/api/*").allowedOrigins("http://vila.farm");
	// 		}
	// 	};
	// }

	@Bean
	public CommandLineRunner commandLineRunner(final ApplicationContext ctx) {
		return args -> {

			System.out.println("viLa application started.");

/* 			final String[] beanNames = ctx.getBeanDefinitionNames();
			Arrays.sort(beanNames);
			for (final String beanName : beanNames) {
				System.out.println(beanName);
			} */

		};
	}

}
