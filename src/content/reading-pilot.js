// Curated content data. See docs/content-model.md for review and release rules.
export const readingPilot = {
  "schemaVersion": 1,
  "id": "reading-pilot",
  "version": 2,
  "origin": "Migration of existing starter content, not newly approved teaching material",
  "sources": {
    "es-libro": {
      "title": "Wiktionary: libro (Spanish)",
      "url": "https://en.wiktionary.org/wiki/libro#Spanish",
      "accessedAt": "2026-10-18",
      "attribution": "Wiktionary contributors",
      "license": "See linked entry reuse terms",
      "scope": "Lexical reference only; not evidence that the full teaching sentence or explanation was reviewed."
    },
    "es-leer": {
      "title": "Wiktionary: leer (Spanish)",
      "url": "https://en.wiktionary.org/wiki/leer#Spanish",
      "accessedAt": "2026-10-18",
      "attribution": "Wiktionary contributors",
      "license": "See linked entry reuse terms",
      "scope": "Lexical reference only; not evidence that the full teaching sentence or explanation was reviewed."
    },
    "fr-livre": {
      "title": "Wiktionary: livre (French)",
      "url": "https://en.wiktionary.org/wiki/livre#French",
      "accessedAt": "2026-10-18",
      "attribution": "Wiktionary contributors",
      "license": "See linked entry reuse terms",
      "scope": "Lexical reference only; not evidence that the full teaching sentence or explanation was reviewed."
    },
    "fr-lire": {
      "title": "Wiktionary: lire (French)",
      "url": "https://en.wiktionary.org/wiki/lire#French",
      "accessedAt": "2026-10-18",
      "attribution": "Wiktionary contributors",
      "license": "See linked entry reuse terms",
      "scope": "Lexical reference only; not evidence that the full teaching sentence or explanation was reviewed."
    },
    "de-Buch": {
      "title": "Wiktionary: Buch (German)",
      "url": "https://en.wiktionary.org/wiki/Buch#German",
      "accessedAt": "2026-10-18",
      "attribution": "Wiktionary contributors",
      "license": "See linked entry reuse terms",
      "scope": "Lexical reference only; not evidence that the full teaching sentence or explanation was reviewed."
    },
    "de-lesen": {
      "title": "Wiktionary: lesen (German)",
      "url": "https://en.wiktionary.org/wiki/lesen#German",
      "accessedAt": "2026-10-18",
      "attribution": "Wiktionary contributors",
      "license": "See linked entry reuse terms",
      "scope": "Lexical reference only; not evidence that the full teaching sentence or explanation was reviewed."
    }
  },
  "lexemes": {
    "es-libro": {
      "id": "es-libro",
      "lang": "es",
      "lemma": "libro",
      "pos": "noun",
      "senseId": "book.bound-pages",
      "gender": "masculine",
      "forms": [
        {
          "text": "libro",
          "number": "singular"
        },
        {
          "text": "libros",
          "number": "plural"
        }
      ],
      "sourceIds": [
        "es-libro"
      ],
      "review": {
        "status": "draft",
        "author": "Codex",
        "reviewer": null,
        "reviewedAt": null,
        "notes": "Migrated from the starter bank. Lexical references attached; sentence naturalness and explanatory claims await independent linguistic review."
      }
    },
    "es-leer": {
      "id": "es-leer",
      "lang": "es",
      "lemma": "leer",
      "pos": "verb",
      "senseId": "read.written-text",
      "forms": [
        {
          "text": "leer",
          "verbForm": "infinitive"
        },
        {
          "text": "leo",
          "verbForm": "finite",
          "mood": "indicative",
          "tense": "present",
          "person": 1,
          "number": "singular"
        }
      ],
      "sourceIds": [
        "es-leer"
      ],
      "review": {
        "status": "draft",
        "author": "Codex",
        "reviewer": null,
        "reviewedAt": null,
        "notes": "Migrated from the starter bank. Lexical references attached; sentence naturalness and explanatory claims await independent linguistic review."
      }
    },
    "fr-livre": {
      "id": "fr-livre",
      "lang": "fr",
      "lemma": "livre",
      "pos": "noun",
      "senseId": "book.bound-pages",
      "gender": "masculine",
      "forms": [
        {
          "text": "livre",
          "number": "singular"
        },
        {
          "text": "livres",
          "number": "plural"
        }
      ],
      "sourceIds": [
        "fr-livre"
      ],
      "review": {
        "status": "draft",
        "author": "Codex",
        "reviewer": null,
        "reviewedAt": null,
        "notes": "Migrated from the starter bank. Lexical references attached; sentence naturalness and explanatory claims await independent linguistic review."
      }
    },
    "fr-lire": {
      "id": "fr-lire",
      "lang": "fr",
      "lemma": "lire",
      "pos": "verb",
      "senseId": "read.written-text",
      "forms": [
        {
          "text": "lire",
          "verbForm": "infinitive"
        },
        {
          "text": "lis",
          "verbForm": "finite",
          "mood": "indicative",
          "tense": "present",
          "person": 1,
          "number": "singular"
        }
      ],
      "sourceIds": [
        "fr-lire"
      ],
      "review": {
        "status": "draft",
        "author": "Codex",
        "reviewer": null,
        "reviewedAt": null,
        "notes": "Migrated from the starter bank. Lexical references attached; sentence naturalness and explanatory claims await independent linguistic review."
      }
    },
    "de-Buch": {
      "id": "de-Buch",
      "lang": "de",
      "lemma": "Buch",
      "pos": "noun",
      "senseId": "book.bound-pages",
      "gender": "neuter",
      "forms": [
        {
          "text": "Buch",
          "number": "singular"
        },
        {
          "text": "Bücher",
          "number": "plural"
        }
      ],
      "sourceIds": [
        "de-Buch"
      ],
      "review": {
        "status": "draft",
        "author": "Codex",
        "reviewer": null,
        "reviewedAt": null,
        "notes": "Migrated from the starter bank. Lexical references attached; sentence naturalness and explanatory claims await independent linguistic review."
      }
    },
    "de-lesen": {
      "id": "de-lesen",
      "lang": "de",
      "lemma": "lesen",
      "pos": "verb",
      "senseId": "read.written-text",
      "forms": [
        {
          "text": "lesen",
          "verbForm": "infinitive"
        },
        {
          "text": "lese",
          "verbForm": "finite",
          "mood": "indicative",
          "tense": "present",
          "person": 1,
          "number": "singular"
        }
      ],
      "sourceIds": [
        "de-lesen"
      ],
      "review": {
        "status": "draft",
        "author": "Codex",
        "reviewer": null,
        "reviewedAt": null,
        "notes": "Migrated from the starter bank. Lexical references attached; sentence naturalness and explanatory claims await independent linguistic review."
      }
    }
  },
  "grammar": {
    "es.present-first-person": {
      "id": "es.present-first-person",
      "lang": "es",
      "description": "A present-tense verb agrees with a first-person singular subject.",
      "sourceIds": [],
      "review": {
        "status": "draft",
        "author": "Codex",
        "reviewer": null,
        "reviewedAt": null,
        "notes": "Migrated from the starter bank. Lexical references attached; sentence naturalness and explanatory claims await independent linguistic review."
      }
    },
    "es.indefinite-object": {
      "id": "es.indefinite-object",
      "lang": "es",
      "description": "An indefinite singular noun phrase serves as the object of reading.",
      "sourceIds": [],
      "review": {
        "status": "draft",
        "author": "Codex",
        "reviewer": null,
        "reviewedAt": null,
        "notes": "Migrated from the starter bank. Lexical references attached; sentence naturalness and explanatory claims await independent linguistic review."
      }
    },
    "fr.present-first-person": {
      "id": "fr.present-first-person",
      "lang": "fr",
      "description": "A present-tense verb agrees with a first-person singular subject.",
      "sourceIds": [],
      "review": {
        "status": "draft",
        "author": "Codex",
        "reviewer": null,
        "reviewedAt": null,
        "notes": "Migrated from the starter bank. Lexical references attached; sentence naturalness and explanatory claims await independent linguistic review."
      }
    },
    "fr.indefinite-object": {
      "id": "fr.indefinite-object",
      "lang": "fr",
      "description": "An indefinite singular noun phrase serves as the object of reading.",
      "sourceIds": [],
      "review": {
        "status": "draft",
        "author": "Codex",
        "reviewer": null,
        "reviewedAt": null,
        "notes": "Migrated from the starter bank. Lexical references attached; sentence naturalness and explanatory claims await independent linguistic review."
      }
    },
    "de.present-first-person": {
      "id": "de.present-first-person",
      "lang": "de",
      "description": "A present-tense verb agrees with a first-person singular subject.",
      "sourceIds": [],
      "review": {
        "status": "draft",
        "author": "Codex",
        "reviewer": null,
        "reviewedAt": null,
        "notes": "Migrated from the starter bank. Lexical references attached; sentence naturalness and explanatory claims await independent linguistic review."
      }
    },
    "de.indefinite-object": {
      "id": "de.indefinite-object",
      "lang": "de",
      "description": "An indefinite singular noun phrase serves as the object of reading.",
      "sourceIds": [],
      "review": {
        "status": "draft",
        "author": "Codex",
        "reviewer": null,
        "reviewedAt": null,
        "notes": "Migrated from the starter bank. Lexical references attached; sentence naturalness and explanatory claims await independent linguistic review."
      }
    }
  },
  "entries": [
    {
      "id": "c3",
      "senseId": "book.bound-pages",
      "type": "noun",
      "prompt": "book",
      "definition": "A written work consisting of bound pages.",
      "translations": {
        "es": {
          "text": "el libro",
          "lexemeIds": [
            "es-libro"
          ],
          "grammarIds": [],
          "sourceIds": [
            "es-libro"
          ],
          "review": {
            "status": "draft",
            "author": "Codex",
            "reviewer": null,
            "reviewedAt": null,
            "notes": "Migrated from the starter bank. Lexical references attached; sentence naturalness and explanatory claims await independent linguistic review."
          },
          "chunks": [
            {
              "text": "el libro",
              "meaning": "(the) book",
              "summary": "Masculine singular noun.",
              "detail": "el is the definite article (“the”); libro means “book”. Learn the article together with the noun; grammatical gender does not always match natural gender.",
              "lexemeIds": [
                "es-libro"
              ],
              "grammarIds": []
            }
          ],
          "wordDetails": {
            "el": {
              "meaning": "the",
              "role": "Definite article · masculine singular",
              "note": "El agrees with libro."
            },
            "libro": {
              "lexeme": "es-libro",
              "meaning": "book",
              "role": "Noun · masculine singular",
              "note": "In the sentence, libro is the direct object of leo."
            }
          }
        },
        "fr": {
          "text": "le livre",
          "lexemeIds": [
            "fr-livre"
          ],
          "grammarIds": [],
          "sourceIds": [
            "fr-livre"
          ],
          "review": {
            "status": "draft",
            "author": "Codex",
            "reviewer": null,
            "reviewedAt": null,
            "notes": "Migrated from the starter bank. Lexical references attached; sentence naturalness and explanatory claims await independent linguistic review."
          },
          "chunks": [
            {
              "text": "le livre",
              "meaning": "(the) book",
              "summary": "Masculine singular noun.",
              "detail": "le is the definite article (“the”); livre means “book”. Learn the article together with the noun; grammatical gender does not always match natural gender.",
              "lexemeIds": [
                "fr-livre"
              ],
              "grammarIds": []
            }
          ],
          "wordDetails": {
            "le": {
              "meaning": "the",
              "role": "Definite article · masculine singular",
              "note": "Le agrees with livre."
            },
            "livre": {
              "lexeme": "fr-livre",
              "meaning": "book",
              "role": "Noun · masculine singular",
              "note": "Here livre means a book, not the feminine noun meaning a pound."
            }
          }
        },
        "de": {
          "text": "das Buch",
          "lexemeIds": [
            "de-Buch"
          ],
          "grammarIds": [],
          "sourceIds": [
            "de-Buch"
          ],
          "review": {
            "status": "draft",
            "author": "Codex",
            "reviewer": null,
            "reviewedAt": null,
            "notes": "Migrated from the starter bank. Lexical references attached; sentence naturalness and explanatory claims await independent linguistic review."
          },
          "chunks": [
            {
              "text": "das Buch",
              "meaning": "(the) book",
              "summary": "Neuter singular noun.",
              "detail": "das is the definite article (“the”); Buch means “book”. The article shown is the nominative singular form. German articles can change with the noun’s role in a sentence.",
              "lexemeIds": [
                "de-Buch"
              ],
              "grammarIds": []
            }
          ],
          "wordDetails": {
            "das": {
              "meaning": "the",
              "role": "Definite article · neuter singular · nominative here",
              "note": "Das matches the gender of Buch in this vocabulary entry."
            },
            "Buch": {
              "lexeme": "de-Buch",
              "meaning": "book",
              "role": "Noun · neuter singular",
              "note": "In the sentence, Buch is the direct object, so the noun phrase is accusative."
            }
          }
        }
      }
    },
    {
      "id": "c19",
      "senseId": "read.written-text",
      "type": "verb",
      "prompt": "to read",
      "definition": "Interpret written text.",
      "translations": {
        "es": {
          "text": "leer",
          "lexemeIds": [
            "es-leer"
          ],
          "grammarIds": [],
          "sourceIds": [
            "es-leer"
          ],
          "review": {
            "status": "draft",
            "author": "Codex",
            "reviewer": null,
            "reviewedAt": null,
            "notes": "Migrated from the starter bank. Lexical references attached; sentence naturalness and explanatory claims await independent linguistic review."
          },
          "chunks": [
            {
              "text": "leer",
              "meaning": "(to) read",
              "summary": "Infinitive — the base form of the verb.",
              "detail": "This form names the action without specifying who does it or when. A sentence uses a conjugated form to match its subject and tense.",
              "lexemeIds": [
                "es-leer"
              ],
              "grammarIds": []
            }
          ],
          "wordDetails": {
            "leer": {
              "lexeme": "es-leer",
              "meaning": "to read",
              "role": "Infinitive",
              "note": "The base form names the action."
            }
          }
        },
        "fr": {
          "text": "lire",
          "lexemeIds": [
            "fr-lire"
          ],
          "grammarIds": [],
          "sourceIds": [
            "fr-lire"
          ],
          "review": {
            "status": "draft",
            "author": "Codex",
            "reviewer": null,
            "reviewedAt": null,
            "notes": "Migrated from the starter bank. Lexical references attached; sentence naturalness and explanatory claims await independent linguistic review."
          },
          "chunks": [
            {
              "text": "lire",
              "meaning": "(to) read",
              "summary": "Infinitive — the base form of the verb.",
              "detail": "This form names the action without specifying who does it or when. A sentence uses a conjugated form to match its subject and tense.",
              "lexemeIds": [
                "fr-lire"
              ],
              "grammarIds": []
            }
          ],
          "wordDetails": {
            "lire": {
              "lexeme": "fr-lire",
              "meaning": "to read",
              "role": "Infinitive",
              "note": "The base form names the action."
            }
          }
        },
        "de": {
          "text": "lesen",
          "lexemeIds": [
            "de-lesen"
          ],
          "grammarIds": [],
          "sourceIds": [
            "de-lesen"
          ],
          "review": {
            "status": "draft",
            "author": "Codex",
            "reviewer": null,
            "reviewedAt": null,
            "notes": "Migrated from the starter bank. Lexical references attached; sentence naturalness and explanatory claims await independent linguistic review."
          },
          "chunks": [
            {
              "text": "lesen",
              "meaning": "(to) read",
              "summary": "Infinitive — the base form of the verb.",
              "detail": "This form names the action without specifying who does it or when. A sentence uses a conjugated form to match its subject and tense.",
              "lexemeIds": [
                "de-lesen"
              ],
              "grammarIds": []
            }
          ],
          "wordDetails": {
            "lesen": {
              "lexeme": "de-lesen",
              "meaning": "to read",
              "role": "Infinitive",
              "note": "The base form names the action."
            }
          }
        }
      }
    },
    {
      "id": "c26",
      "senseId": "read.book.first-person",
      "type": "sentence",
      "prompt": "I read a book.",
      "definition": "The speaker reads one unspecified book.",
      "translations": {
        "es": {
          "text": "Leo un libro.",
          "lexemeIds": [
            "es-libro",
            "es-leer"
          ],
          "grammarIds": [
            "es.present-first-person",
            "es.indefinite-object"
          ],
          "sourceIds": [
            "es-libro",
            "es-leer"
          ],
          "review": {
            "status": "draft",
            "author": "Codex",
            "reviewer": null,
            "reviewedAt": null,
            "notes": "Migrated from the starter bank. Lexical references attached; sentence naturalness and explanatory claims await independent linguistic review."
          },
          "chunks": [
            {
              "text": "Leo",
              "meaning": "(I) read",
              "summary": "Present tense · leer",
              "detail": "Leo is the first-person singular form of leer. The subject yo is understood.",
              "lexemeIds": [
                "es-leer"
              ],
              "grammarIds": [
                "es.present-first-person"
              ]
            },
            {
              "text": " "
            },
            {
              "text": "un libro",
              "meaning": "(a) book",
              "summary": "Masculine singular noun",
              "detail": "Un is the masculine singular indefinite article. Libro is the object of leo.",
              "lexemeIds": [
                "es-libro"
              ],
              "grammarIds": [
                "es.indefinite-object"
              ]
            },
            {
              "text": "."
            }
          ],
          "wordDetails": {
            "Leo": {
              "lexeme": "es-leer",
              "meaning": "(I) read",
              "role": "Present indicative · first person singular",
              "note": "Leo is the yo form of leer; the subject “I” is understood."
            },
            "un": {
              "meaning": "a",
              "role": "Indefinite article · masculine singular",
              "note": "Un introduces one unspecified book and agrees with libro."
            },
            "libro": {
              "lexeme": "es-libro",
              "meaning": "book",
              "role": "Noun · masculine singular",
              "note": "In the sentence, libro is the direct object of leo."
            }
          }
        },
        "fr": {
          "text": "Je lis un livre.",
          "lexemeIds": [
            "fr-livre",
            "fr-lire"
          ],
          "grammarIds": [
            "fr.present-first-person",
            "fr.indefinite-object"
          ],
          "sourceIds": [
            "fr-livre",
            "fr-lire"
          ],
          "review": {
            "status": "draft",
            "author": "Codex",
            "reviewer": null,
            "reviewedAt": null,
            "notes": "Migrated from the starter bank. Lexical references attached; sentence naturalness and explanatory claims await independent linguistic review."
          },
          "chunks": [
            {
              "text": "Je",
              "meaning": "I",
              "summary": "Subject pronoun",
              "detail": "Je is the subject of lis.",
              "lexemeIds": [],
              "grammarIds": []
            },
            {
              "text": " "
            },
            {
              "text": "lis",
              "meaning": "read",
              "summary": "Present tense · lire",
              "detail": "Lis agrees with je here.",
              "lexemeIds": [
                "fr-lire"
              ],
              "grammarIds": [
                "fr.present-first-person"
              ]
            },
            {
              "text": " "
            },
            {
              "text": "un livre",
              "meaning": "(a) book",
              "summary": "Masculine singular noun",
              "detail": "Un agrees with livre. The phrase is the object of lis.",
              "lexemeIds": [
                "fr-livre"
              ],
              "grammarIds": [
                "fr.indefinite-object"
              ]
            },
            {
              "text": "."
            }
          ],
          "wordDetails": {
            "Je": {
              "meaning": "I",
              "role": "Subject pronoun · first person singular",
              "note": "Je is the subject of lis."
            },
            "lis": {
              "lexeme": "fr-lire",
              "meaning": "read",
              "role": "Present indicative · first person singular here",
              "note": "Lis agrees with je in this sentence. The same form also occurs with tu."
            },
            "un": {
              "meaning": "a",
              "role": "Indefinite article · masculine singular",
              "note": "Un agrees with livre, the object of lis."
            },
            "livre": {
              "lexeme": "fr-livre",
              "meaning": "book",
              "role": "Noun · masculine singular",
              "note": "Here livre means a book, not the feminine noun meaning a pound."
            }
          }
        },
        "de": {
          "text": "Ich lese ein Buch.",
          "lexemeIds": [
            "de-Buch",
            "de-lesen"
          ],
          "grammarIds": [
            "de.present-first-person",
            "de.indefinite-object"
          ],
          "sourceIds": [
            "de-Buch",
            "de-lesen"
          ],
          "review": {
            "status": "draft",
            "author": "Codex",
            "reviewer": null,
            "reviewedAt": null,
            "notes": "Migrated from the starter bank. Lexical references attached; sentence naturalness and explanatory claims await independent linguistic review."
          },
          "chunks": [
            {
              "text": "Ich",
              "meaning": "I",
              "summary": "Subject pronoun",
              "detail": "Ich is the subject of lese.",
              "lexemeIds": [],
              "grammarIds": []
            },
            {
              "text": " "
            },
            {
              "text": "lese",
              "meaning": "read",
              "summary": "Present tense · lesen",
              "detail": "Lese is the first-person singular form of lesen.",
              "lexemeIds": [
                "de-lesen"
              ],
              "grammarIds": [
                "de.present-first-person"
              ]
            },
            {
              "text": " "
            },
            {
              "text": "ein Buch",
              "meaning": "(a) book",
              "summary": "Neuter singular · accusative",
              "detail": "Buch is the direct object. The neuter article ein stays the same in the accusative.",
              "lexemeIds": [
                "de-Buch"
              ],
              "grammarIds": [
                "de.indefinite-object"
              ]
            },
            {
              "text": "."
            }
          ],
          "wordDetails": {
            "Ich": {
              "meaning": "I",
              "role": "Subject pronoun · first person singular · nominative",
              "note": "Ich is the subject of lese."
            },
            "lese": {
              "lexeme": "de-lesen",
              "meaning": "read",
              "role": "Present indicative · first person singular",
              "note": "Lese agrees with ich."
            },
            "ein": {
              "meaning": "a",
              "role": "Indefinite article · neuter singular · accusative here",
              "note": "Ein agrees with Buch. The neuter article has the same form in nominative and accusative."
            },
            "Buch": {
              "lexeme": "de-Buch",
              "meaning": "book",
              "role": "Noun · neuter singular",
              "note": "In the sentence, Buch is the direct object, so the noun phrase is accusative."
            }
          }
        }
      }
    }
  ]
};
