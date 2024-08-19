import envConfig from "../config/envConfig";
import { Client, ID, Databases, Query, Storage } from "appwrite";

export class Service {
  client = new Client();
  databases;
  bucket;

  constructor() {
    this.client
      .setEndpoint(envConfig.appwriteUrl)
      .setProject(envConfig.appwriteProjectId);
    this.databases = new Databases(this.client);
    this.bucket = new Storage(this.client);
  }

  async createPost({ title, slug, content, featuredImage, status, userId }) {
    try {
      return await this.databases.createDocument(
        envConfig.appwriteDatabaseId,
        envConfig.appwriteCollectionId,
        slug,
        {
          title,
          content,
          featuredImage,
          status,
          userId,
        }
      );
    } catch (error) {
      console.log("Error while creating post :: ", error);
    }
  }

  async updatePost(slug, { title, content, featuredImage, status }) {
    try {
      return await this.databases.updateDocument(
        envConfig.appwriteDatabaseId,
        envConfig.appwriteCollectionId,
        slug,
        {
          title,
          content,
          featuredImage,
          status,
        }
      );
    } catch (error) {
      console.log("Errors while updating post ::", error);
    }
  }

  async getPost(slug) {
    try {
      return await this.databases.getDocument(
        envConfig.appwriteDatabaseId,
        envConfig.appwriteCollectionId,
        slug
      );
    } catch (error) {
      console.log("Errors while getDocument :: ", error);
      return false;
    }
  }

  async getAllPosts(queries = [Query.equal("status", "active")]) {
    try {
      return await this.databases.listDocuments(
        envConfig.appwriteDatabaseId,
        envConfig.appwriteCollectionId,
        queries
      );
    } catch (error) {
      console.log("Errors while getting all posts :: ", error);
      return false;
    }
  }

  async deletePost(slug) {
    try {
      await this.databases.deleteDocument(
        envConfig.appwriteDatabaseId,
        envConfig.appwriteCollectionId,
        slug
      );
      return true;
    } catch (error) {
      console.log("Error while deleting post :: ", error);
      return false;
    }
  }

  //  File Management
  async uploadFile(file) {
    try {
      return await this.bucket.createFile(
        envConfig.appwriteBucketId,
        ID.unique(),
        file
      );
    } catch (error) {
      console.log("Errors while uploading :: ", error);
      return false;
    }
  }

  getFilePreview(fileId) {
    return this.bucket.getFilePreview(envConfig.appwriteBucketId, fileId);
  }

  async deleteFile(fileId) {
    try {
      await this.bucket.deleteFile(envConfig.appwriteBucketId, fileId);
      return true;
    } catch (error) {
      console.log("Errors while Deleting File ::", error);
      return false;
    }
  }
}

const appwriteService = new Service();
export default appwriteService;
