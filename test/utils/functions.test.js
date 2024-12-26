// tests/utils/functions.test.js
const functionsModule = require("../../fastmvpcore/utils/functions");

describe("functionsModule.js", () => {
  describe("sanitationStringSql", () => {
    test("should sanitize a string by removing accents and SQL injection risks", () => {
      const input = "Héllo'; DROP TABLE users; --";
      const expected = "Hello DROP TABLE users --";
      const result = functionsModule.sanitationStringSql(input);
      expect(result).toBe(expected);
    });

    test("should return null for invalid inputs", () => {
      expect(functionsModule.sanitationStringSql(null)).toBeNull();
      expect(functionsModule.sanitationStringSql({})).toBeNull();
      expect(functionsModule.sanitationStringSql([])).toBeNull();
    });

    test("should convert numbers to strings and sanitize them", () => {
      const input = 12345;
      const expected = "12345";
      const result = functionsModule.sanitationStringSql(input);
      expect(result).toBe(expected);
    });
  });

  describe("errorControlWithSqlCode", () => {
    test("should return a proper response for error code 42P01", () => {
      const errorJson = { error: { code: "42P01" } };
      const tableName = "test_table";
      const result = functionsModule.errorControlWithSqlCode(
        errorJson,
        tableName
      );

      expect(result).toEqual({
        conditional: true,
        payload: {
          status: "error",
          msg: "No existe la tabla test_table",
          code: "42P01",
          detail: tableName,
          data: null,
        },
      });
    });

    test("should return default response for unknown error codes", () => {
      const errorJson = { error: { code: "99999" } };
      const result = functionsModule.errorControlWithSqlCode(
        errorJson,
        "table"
      );
      expect(result).toEqual({
        conditional: false,
        payload: errorJson,
      });
    });
  });

  describe("generateRandomString", () => {
    test("should generate a random string of the specified length", () => {
      const length = 10;
      const result = functionsModule.generateRandomString(length);
      expect(result).toHaveLength(length);
      expect(typeof result).toBe("string");
    });

    test("should generate strings with random characters", () => {
      const string1 = functionsModule.generateRandomString(10);
      const string2 = functionsModule.generateRandomString(10);
      expect(string1).not.toBe(string2); // Asegura que los valores son diferentes
    });
  });

  describe("isNoEmptyJSON", () => {
    test("should return true for a non-empty JSON object", () => {
      const input = { key: "value" };
      const result = functionsModule.isNoEmptyJSON(input);
      expect(result).toBe(true);
    });

    test("should return false for an empty object", () => {
      const input = {};
      const result = functionsModule.isNoEmptyJSON(input);
      expect(result).toBe(false);
    });

    test("should return false for invalid inputs", () => {
      expect(functionsModule.isNoEmptyJSON(null)).toBe(false);
      expect(functionsModule.isNoEmptyJSON("string")).toBe(false);
    });
  });

  describe("replaceKeyValue", () => {
    test("should replace matching keys in a JSON object", () => {
      const jsonObj = {
        authData: "AUTH::id_profile",
        nested: { key: "AUTH::username" },
      };
      const replacements = { id_profile: 123, username: "user123" };

      functionsModule.replaceKeyValue(jsonObj, "AUTH::", replacements);

      expect(jsonObj).toEqual({
        authData: 123,
        nested: { key: "user123" },
      });
    });

    test("should handle non-matching keys gracefully", () => {
      const jsonObj = { key: "AUTH::nonexistent" };
      const replacements = { id_profile: 123 };

      functionsModule.replaceKeyValue(jsonObj, "AUTH::", replacements);

      expect(jsonObj).toEqual({ key: undefined });
    });
  });
});
