const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../index"); // Update this path if your main app file is named differently
const expect = chai.expect;

chai.use(chaiHttp);

describe("Tasks API", () => {
  before((done) => {
    // Run any necessary setup before the tests
    done();
  });

  after((done) => {
    // Run any necessary teardown after the tests
    done();
  });

  beforeEach((done) => {
    // Run any necessary setup before each test
    done();
  });

  afterEach((done) => {
    // Run any necessary teardown after each test
    done();
  });

  describe("GET /tasks", () => {
    it("should get all tasks in descending order of creation date", (done) => {
      chai
        .request(app)
        .get("/tasks")
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.an("array");

          if (res.body.length > 1) {
            // Check if tasks are in descending order of creation date
            const createdAtList = res.body.map((task) => task.createdAt);
            expect(createdAtList).to.satisfy((dates) => {
              return dates.every((date, i) => {
                if (i > 0) {
                  return new Date(date) >= new Date(dates[i - 1]);
                }
                return true;
              });
            });
          }

          done();
        });
    });
  });

  describe("POST /tasks", () => {
    it("should create a new task", (done) => {
      const taskData = {
        title: "New Task",
        description: "Task description",
        status: "Pending",
      };

      chai
        .request(app)
        .post("/tasks")
        .send(taskData)
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res).to.be.json;
          expect(res.body).to.be.an("object");
          expect(res.body.title).to.equal(taskData.title);
          expect(res.body.description).to.equal(taskData.description);
          expect(res.body.status).to.equal(taskData.status);
          done();
        });
    });

    it("should return an error if request data is invalid", (done) => {
      const invalidTaskData = {
        // Missing required fields
      };

      chai
        .request(app)
        .post("/tasks")
        .send(invalidTaskData)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res).to.be.json;
          expect(res.body).to.have.property("error");
          done();
        });
    });
  });

  describe("PUT /tasks/:id", () => {
    it("should update the status of a task", (done) => {
      const taskData = {
        status: "Completed",
      };

      chai
        .request(app)
        .put("/tasks/:id") // Replace :id with a valid task ID
        .send(taskData)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.an("object");
          expect(res.body.status).to.equal(taskData.status);
          done();
        });
    });

    it("should return an error if task ID is invalid", (done) => {
      const taskData = {
        status: "Completed",
      };

      chai
        .request(app)
        .put("/tasks/invalid-id")
        .send(taskData)
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res).to.be.json;
          expect(res.body).to.have.property("error");
          done();
        });
    });

    it("should return an error if request data is invalid", (done) => {
      const invalidTaskData = {
        // Invalid status value
      };

      chai
        .request(app)
        .put("/tasks/:id") // Replace :id with a valid task ID
        .send(invalidTaskData)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res).to.be.json;
          expect(res.body).to.have.property("error");
          done();
        });
    });
  });

  describe("DELETE /tasks/:id", () => {
    it("should delete a task", (done) => {
      chai
        .request(app)
        .delete("/tasks/:id") // Replace :id with a valid task ID
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.have.property("message");
          done();
        });
    });

    it("should return an error if task ID is invalid", (done) => {
      chai
        .request(app)
        .delete("/tasks/invalid-id")
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res).to.be.json;
          expect(res.body).to.have.property("error");
          done();
        });
    });
  });
});
