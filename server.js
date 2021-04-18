"use strict";

class Server {
  constructor() {
    // pass
  }

  start() {
    const fs = require("fs");
    // external dependencies
    const express = require("express");
    // const bodyParser = require("body-parser");
    const helmet = require("helmet");
    const morgan = require("morgan");
    const rateLimit = require("express-rate-limit");

    // express y middlewares init
    this.app = express();
    this.app.use(helmet());
    this.app.use(morgan("combined"));
    this.app.use(
      rateLimit({
        windowMs: 1 * 60 * 1000, // 1 minutes window
        max: 10, // start blocking after 5 requests
        message:
          "Too many requests created from this IP, please try again later"
      })
    );

    // config bodyParser
    this.app.use(express.json());
    this.app.use(express.urlencoded({extended: true}));
    // this.app.use(
    //   bodyParser.urlencoded({
    //     extended: true
    //   })
    // );
    // this.app.use(bodyParser.text());
    // this.app.use(
    //   bodyParser.json({
    //     type: "application/json",
    //     limit: "20mb"
    //   })
    // );

    // documentacion
    const swaggerJsDoc = require("swagger-jsdoc");
    const swaggerUi = require("swagger-ui-express");
    const swaggerOptions = {
      swaggerDefinition: {
        info: {
          version: "1.0.0",
          title: "Finance",
          description: "Your best personal finance planner",
          contact: {
            name: "Diegol Ramírez-Milano"
          },
          servers: ["http://localhost:3000"]
        }
      },
      apis: ["services/*/api.js"]
    };

    const swaggerDocs = swaggerJsDoc(swaggerOptions);
    this.app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

    // APIs init
    let dirServices = "./services";
    let dirss = fs.readdirSync(dirServices);
    for (let i = 0; i < dirss.length; i++) {
      let path = dirss[i];
      let pathTabla = `${dirServices}/${path}`;
      let pathApi = `${pathTabla}/api.js`;
      if (fs.lstatSync(pathTabla).isDirectory() && fs.existsSync(pathApi)) {
        let api = require(pathApi);
        api(this.app, `/api/${path}`);
      }
    }

    // server init
    this.app.listen(process.env.PORT || 3000, () => {
      console.log(
        `Sever initialized in env: ${process.env.NODE_ENV ||
          "test"} and port: ${process.env.PORT || 3000}`
      );
    });
  }

  close() {
    this.app.close();
  }
}

module.exports = new Server();
