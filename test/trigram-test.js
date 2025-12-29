// Test para verificar la implementación de trigrams
const toAssenbleModule = require("../fastmvpcore/utils/toassemble");

// Test 1: Similarity
const test1 = {
  where: {
    type: "trigram",
    trigram: "similarity",
    conditional: {
      name: "Juan"
    }
  }
};

console.log("Test 1 - Similarity:");
console.log("SELECT:", toAssenbleModule.makeSqlStringSelect(test1));
console.log("WHERE:", toAssenbleModule.makeSqlStringSelectWhere(test1));

// Test 2: Word Similarity
const test2 = {
  where: {
    type: "trigram",
    trigram: "word_similarity",
    conditional: {
      description: "producto electronico"
    }
  }
};

console.log("\nTest 2 - Word Similarity:");
console.log("SELECT:", toAssenbleModule.makeSqlStringSelect(test2));
console.log("WHERE:", toAssenbleModule.makeSqlStringSelectWhere(test2));

// Test 3: Strict Word Similarity
const test3 = {
  where: {
    type: "trigram",
    trigram: "strict_word_similarity",
    conditional: {
      title: "consulta medica"
    }
  }
};

console.log("\nTest 3 - Strict Word Similarity:");
console.log("SELECT:", toAssenbleModule.makeSqlStringSelect(test3));
console.log("WHERE:", toAssenbleModule.makeSqlStringSelectWhere(test3));

// Test 4: Distance
const test4 = {
  where: {
    type: "trigram",
    trigram: "distance",
    conditional: {
      content: "texto a buscar"
    }
  }
};

console.log("\nTest 4 - Distance:");
console.log("SELECT:", toAssenbleModule.makeSqlStringSelect(test4));
console.log("WHERE:", toAssenbleModule.makeSqlStringSelectWhere(test4));

// Test 5: Word Distance
const test5 = {
  where: {
    type: "trigram",
    trigram: "word_distance",
    conditional: {
      description: "busqueda avanzada"
    }
  }
};

console.log("\nTest 5 - Word Distance:");
console.log("SELECT:", toAssenbleModule.makeSqlStringSelect(test5));
console.log("WHERE:", toAssenbleModule.makeSqlStringSelectWhere(test5));

// Test 6: Combinación con otros filtros
const test6 = {
  where: {
    conditionals: [
      {
        type: "iqual",
        conditional: {
          status: "active"
        }
      },
      "AND",
      {
        type: "trigram",
        trigram: "similarity",
        conditional: {
          name: "producto"
        }
      }
    ]
  }
};

console.log("\nTest 6 - Combinación con filtros:");
console.log("SELECT:", toAssenbleModule.makeSqlStringSelect(test6));
console.log("WHERE:", toAssenbleModule.makeSqlStringSelectWhere(test6));

// Test 7: Con filtros específicos
const test7 = {
  filters: ["id", "name", "email"],
  where: {
    type: "trigram",
    trigram: "strict_word_similarity",
    conditional: {
      id_user: "AUTH::id_profile"
    }
  },
  limit: 50
};

console.log("\nTest 7 - Con filtros específicos:");
console.log("SELECT:", toAssenbleModule.makeSqlStringSelect(test7));
console.log("WHERE:", toAssenbleModule.makeSqlStringSelectWhere(test7));
console.log("LIMIT:", toAssenbleModule.makeSqlStringSelectLimit(test7));

// Test 8: Consulta completa simulada
const completeTest = {
  filters: ["id", "name", "email"],
  where: {
    type: "trigram",
    trigram: "strict_word_similarity",
    conditional: {
      id_user: "AUTH::id_profile"
    }
  },
  limit: 50
};

console.log("\nTest 8 - Consulta completa simulada:");
const query = `SELECT ${toAssenbleModule.makeSqlStringSelect(completeTest)} FROM tabla ${toAssenbleModule.makeSqlStringSelectWhere(completeTest)} ${toAssenbleModule.makeSqlStringSelectLimit(completeTest)}`;
console.log("SQL COMPLETO:", query);