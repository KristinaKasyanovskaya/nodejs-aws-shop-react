import * as cdk from "aws-cdk-lib";
import { Bucket } from "aws-cdk-lib/aws-s3";
import { RemovalPolicy } from "aws-cdk-lib";
import {
  CloudFrontWebDistribution,
  OriginAccessIdentity,
} from "aws-cdk-lib/aws-cloudfront";
import { Construct } from "constructs";

export class MyRepoStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const bucket = new Bucket(this, "MyRepoBucket", {
      websiteIndexDocument: "index.html",
      publicReadAccess: false,
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    const oai = new OriginAccessIdentity(this, "MyRepoOAI");
    bucket.grantRead(oai);

    const distribution = new CloudFrontWebDistribution(
      this,
      "MyRepoDistribution",
      {
        originConfigs: [
          {
            s3OriginSource: {
              s3BucketSource: bucket,
              originAccessIdentity: oai,
            },
            behaviors: [{ isDefaultBehavior: true }],
          },
        ],
      }
    );

    new cdk.CfnOutput(this, "CloudFrontURL", {
      value: distribution.distributionDomainName,
    });

    new cdk.CfnOutput(this, "S3BucketName", {
      value: bucket.bucketName,
    });
  }
}
