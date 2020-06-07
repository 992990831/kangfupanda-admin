
export const Constants = {
    
    // APIBaseUrl: process.env.NODE_ENV === "production"? "http://106.75.216.135:8004/" : "https://localhost:44362/",
    APIBaseUrl: process.env.NODE_ENV === "production"? "http://47.111.166.154:8004/" : "https://localhost:44362/",
    ResourceUrl: process.env.NODE_ENV === "production"? "http://47.111.166.154:8004/Upload/" : "https://localhost:44362/Upload/",
    //OfficialSiteResourceUrl: process.env.NODE_ENV === "production"? "http://app.kangfupanda.com/Site/" : "https://localhost:44362/Site/",
    OfficialSiteResourceUrl: process.env.NODE_ENV === "production"? "http://47.111.166.154:8004/Site/" : "https://localhost:44362/Site/",
}
