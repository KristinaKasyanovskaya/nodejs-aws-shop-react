import * as cdk from "aws-cdk-lib";
import { MyRepoStack } from "../lib/my-repo-stack";

const app = new cdk.App();
new MyRepoStack(app, "MyRepoStack");
