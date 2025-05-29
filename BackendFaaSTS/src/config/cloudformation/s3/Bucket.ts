const Bucket = {
 Bucket: {
    Type: "AWS::S3::Bucket",
    Properties: {
        BucketName: "${self:service}-${self:provider.stage}-${self:provider.region}-bucket",
        //AccessControl: "PublicReadWrite",
        CorsConfiguration: {
        CorsRules: [
            {
                AllowedOrigins: ["*"],
                AllowedHeaders: ["*"],
                AllowedMethods: ["GET", "PUT", "POST", "DELETE", "HEAD"],
                MaxAge: 3000,
            },
        ],
        },
        VersioningConfiguration: {
            Status: "Enabled",
        },
        OwnershipControls: {
            Rules: [
                {
                    ObjectOwnership: "ObjectWriter",
                },
            ]
        },
        PublicAccessBlockConfiguration: {
            BlockPublicAcls: false,
            BlockPublicPolicy: false,
            IgnorePublicAcls: false,
            RestrictPublicBuckets: false,
        },
    },
 }
}

export default Bucket