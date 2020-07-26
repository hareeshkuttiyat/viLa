export enum PostType {
  Ad = "Ad",
  ForumPost = "ForumPost",
  ContactInfo = "ContactInfo",
  Article = "Article"
}
export class Post {

  public postId: string;
  public caption: string;
  public details: string;
  public picture: string;
  public postedDate: Date;
  public postType: PostType;
  public phoneNumber: String;
  public emailId: String;
  public district: string;
  public postKey: string;

  //   static newInstance({ aCaption, aDetails, aPicture }: { aCaption: string; aDetails: string; aPicture: string; }) {
  static newInstance(aCaption: string, aDetails: string, aPicture: string) {
      const newPost = new Post();
      newPost.caption = aCaption;
      newPost.details = aDetails;
      newPost.picture = aPicture;

      return newPost;
  }
}
