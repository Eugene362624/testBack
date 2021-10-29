const config = {
    dbUrl: process.env.DBURL || `mongodb://mongo-db:27017/`,
    port: process.env.PORT || 3000,
    env: process.env.NODE_ENV || "development"
  };
  
module.exports = config;