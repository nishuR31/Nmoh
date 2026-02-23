import envf from "envf";
// import dotenv from "dotenv";
//
// Load .env (for dotenv) and back.env (for envf)
// dotenv.config({path:"../../back.env"});
// envf loads back.env for legacy/config compatibility
envf.setKeys(Object.keys(envf.load("../../../.env")));
// envf.setKeys(Object.keys(envf.load("../../../.env")));
