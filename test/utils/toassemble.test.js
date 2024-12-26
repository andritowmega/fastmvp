// toassemble.test.js
const toAssembleModule = require("../../fastmvpcore/utils/toassemble");
const bcrypt = require("bcryptjs");

// Mock the utility functions required by the module
jest.mock("../../fastmvpcore/utils/functions", () => ({
  isNoEmptyJSON: jest.fn((obj) => obj && Object.keys(obj).length > 0),
  sanitationStringSql: jest.fn((input) => input), // For simplicity, just return the input
}));

describe("toAssembleModule.js", () => {
  describe("makeSqlStringInsert", () => {
    it("should generate a correct SQL insert string with hashed password", () => {
      const input = { username: "user1", password: "mypassword" };
      const result = toAssembleModule.makeSqlStringInsert(input);

      // Verify password is hashed
      expect(bcrypt.compareSync("mypassword", input.password)).toBe(true);

      // Verify SQL string
      expect(result).toBe("(username, password) VALUES ($1, $2) RETURNING *");
    });

    it("should return null for empty input", () => {
      expect(toAssembleModule.makeSqlStringInsert({})).toBeNull();
    });
  });

  describe("makeSqlStringUpdate", () => {
    it("should generate a correct SQL update string", () => {
      const input = { username: "user1", password: "mypassword" };
      const condition = { key: "id", value: "123" };
      const result = toAssembleModule.makeSqlStringUpdate(input, condition);

      // Verify password is hashed
      expect(bcrypt.compareSync("mypassword", input.password)).toBe(true);

      // Verify SQL string
      expect(result).toBe(
        "username=$1, password=$2 WHERE id = '123' RETURNING *"
      );
    });

    it("should handle increment and decrement operations in input", () => {
      const input = { points: "PLUS::10", deductions: "MINUS::5" };
      const condition = { key: "id", value: "456" };
      const result = toAssembleModule.makeSqlStringUpdate(input, condition);

      expect(result).toBe(
        "points=points + $1, deductions=deductions - $2 WHERE id = '456' RETURNING *"
      );
    });

    it("should return null for empty input", () => {
      expect(toAssembleModule.makeSqlStringUpdate({}, {})).toBeNull();
    });
  });

  describe("makeSqlStringDelete", () => {
    it("should generate a correct SQL delete string", () => {
      const condition = { key: "id", value: "789" };
      const result = toAssembleModule.makeSqlStringDelete(condition);

      expect(result).toBe(" WHERE id = '789' RETURNING *");
    });
  });

  describe("makeSqlStringSelect", () => {
    it("should generate a SELECT SQL string with functions", () => {
      const input = { functions: ["SUM::points", "COUNT::users"] };
      const result = toAssembleModule.makeSqlStringSelect(input);

      expect(result).toBe("SUM(points), COUNT(users)");
    });

    it("should return a wildcard SELECT if no functions or filters are provided", () => {
      expect(toAssembleModule.makeSqlStringSelect({})).toBe(" * ");
    });
  });

  describe("makeSqlStringSelectWhere", () => {
    it("should generate a WHERE clause for conditionals", () => {
      const input = {
        where: {
          conditionals: [
            { type: "iqual", conditional: { username: "john" } },
            "AND",
            { type: "greaterthan", conditional: { points: 10 } },
          ],
        },
      };
      const result = toAssembleModule.makeSqlStringSelectWhere(input);

      expect(result).toBe(" WHERE  username='john'  AND  points > '10' ");
    });

    it("should return an empty string if no conditions are provided", () => {
      expect(toAssembleModule.makeSqlStringSelectWhere({})).toBe("");
    });
  });

  describe("makeSqlStringSelectOrder", () => {
    it("should generate an ORDER BY clause", () => {
      const input = { order: { username: "ASC" } };
      const result = toAssembleModule.makeSqlStringSelectOrder(input);

      expect(result).toBe(" ORDER BY username ASC");
    });

    it("should return an empty string if no order is provided", () => {
      expect(toAssembleModule.makeSqlStringSelectOrder({})).toBe("");
    });
  });

  describe("makeSqlStringSelectLimit", () => {
    it("should generate a LIMIT clause", () => {
      const input = { limit: 10 };
      const result = toAssembleModule.makeSqlStringSelectLimit(input);

      expect(result).toBe(" limit 10");
    });

    it("should return an empty string if no limit is provided", () => {
      expect(toAssembleModule.makeSqlStringSelectLimit({})).toBe("");
    });
  });
});
