
export const Constants = {

    // APIBaseUrl: process.env.NODE_ENV === "production"? "http://106.75.216.135:8004/" : "https://localhost:44362/",
    APIBaseUrl: process.env.NODE_ENV === "production" ? "https://api.kangfupanda.com/" : "https://localhost:44362/",
    ResourceUrl: process.env.NODE_ENV === "production" ? "https://api.kangfupanda.com/Upload/" : "https://localhost:44362/Upload/",
    
    //专家证书
    ResourceCertUrl: process.env.NODE_ENV === "production" ? "https://api.kangfupanda.com/Upload/certificate/" : "https://localhost:44362/Upload/certificate/",

    //专家介绍录像
    ResourceProfileVideoUrl: process.env.NODE_ENV === "production" ? "https://api.kangfupanda.com/Upload/introvideo/" : "https://localhost:44362/Upload/introvideo/",

    //APIBaseUrl: process.env.NODE_ENV === "production"? "http://47.111.166.154:8004/" : "https://localhost:44362/",
    //ResourceUrl: process.env.NODE_ENV === "production"? "http://47.111.166.154:8004/Upload/" : "https://localhost:44362/Upload/",
    //OfficialSiteResourceUrl: process.env.NODE_ENV === "production"? "http://app.kangfupanda.com/Site/" : "https://localhost:44362/Site/",
    OfficialSiteResourceUrl: process.env.NODE_ENV === "production" ? "https://api.kangfupanda.com/Site/" : "https://localhost:44362/Site/",
    //OfficialSiteResourceUrl: process.env.NODE_ENV === "production"? "http://47.111.166.154:8004/Site/" : "https://localhost:44362/Site/",
}
