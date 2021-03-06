const document = `
{
  "swagger": "2.0",
  "info": {
    "version": "1.0.0",
    "title": "OpenAPI Express Sample"
  },
  "host": "localhost",
  "basePath": "/v1",
  "tags": [
    {
      "name": "user",
      "description": "ユーザーについて"
    },
    {
      "name": "player",
      "description": "プレイヤーについて"
    },
    {
      "name": "npc",
      "description": "NPCについて"
    },
    {
      "name": "room",
      "description": "ルームについて"
    },
    {
      "name": "game",
      "description": "ゲームについて"
    },
    {
      "name": "field",
      "description": "フィールドについて"
    },
    {
      "name": "square",
      "description": "マスについて"
    }
  ],
  "paths": {
    "/users/{id}": {
      "get": {
        "tags": [
          "user"
        ],
        "summary": "ユーザーを取得する",
        "operationId": "getUser",
        "consumes": [
          "application/json"
        ],
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "in": "path",
            "name": "id",
            "description": "ユーザーのID",
            "required": true,
            "type": "string"
          }
        ],
        "responses": {
          "200": {
            "description": "成功ステータス",
            "schema": {
              "$ref": "#/definitions/User"
            }
          }
        }
      }
    },
    "/users": {
      "get": {
        "tags": [
          "user"
        ],
        "summary": "ユーザーを取得する",
        "operationId": "getAllUser",
        "consumes": [
          "application/json"
        ],
        "produces": [
          "application/json"
        ],
        "responses": {
          "200": {
            "description": "成功ステータス",
            "schema": {
              "type": "array",
              "items": {
                "type": "object",
                "$ref": "#/definitions/Player"
              }
            }
          }
        }
      },
      "post": {
        "tags": [
          "user"
        ],
        "summary": "ユーザーの新規作成する",
        "parameters": [
          {
            "in": "body",
            "name": "body",
            "required": true,
            "schema": {
              "type": "object",
              "properties": {
                "name": {
                  "type": "string",
                  "example": "ユーザーA"
                }
              }
            }
          }
        ],
        "responses": {
          "201": {
            "description": "成功ステータス",
            "schema": {
              "type": "object",
              "properties": {
                "message": {
                  "type": "string",
                  "example": "ユーザーの新規作成が完了しました"
                }
              }
            }
          }
        }
      }
    }
  },
  "definitions": {
    "User": {
      "type": "object",
      "properties": {
        "uid": {
          "type": "string",
          "example": "jgrih385gh31hg03nbhg0475h3b0"
        },
        "name": {
          "type": "string",
          "example": "ユーザーA"
        },
        "point": {
          "type": "integer",
          "format": "int64",
          "example": 300
        }
      }
    },
    "Player": {
      "type": "object",
      "properties": {
        "uid": {
          "type": "string",
          "example": "jgrih385gh31hg03nbhg0475h3b0"
        },
        "name": {
          "type": "string",
          "example": "ユーザーA"
        },
        "point": {
          "type": "integer",
          "format": "int64",
          "example": 10
        },
        "position": {
          "$ref": "#/definitions/Position"
        },
        "status": {
          "type": "string",
          "enum": [
            "alive",
            "dead"
          ],
          "example": "alive"
        }
      }
    },
    "Position": {
      "type": "object",
      "properties": {
        "x": {
          "type": "integer",
          "format": "int64",
          "example": 1
        },
        "y": {
          "type": "integer",
          "format": "int64",
          "example": 3
        }
      }
    },
    "Npc": {
      "type": "object",
      "properties": {
        "position": {
          "$ref": "#/definitions/Position"
        },
        "name": {
          "type": "string",
          "example": "鬼A"
        }
      }
    },
    "Game": {
      "type": "object",
      "properties": {
        "field": {
          "$ref": "#/definitions/Field"
        },
        "players": {
          "type": "array",
          "items": {
            "type": "object",
            "$ref": "#/definitions/Player"
          }
        },
        "npc": {
          "type": "object",
          "$ref": "#/definitions/Npc"
        }
      }
    },
    "Field": {
      "type": "object",
      "properties": {
        "length": {
          "type": "integer",
          "format": "int64",
          "example": 32
        },
        "squares": {
          "type": "array",
          "items": {
            "type": "array",
            "items": {
              "type": "object",
              "$ref": "#/definitions/Square"
            }
          }
        }
      }
    },
    "Square": {
      "type": "object",
      "properties": {
        "height": {
          "type": "integer",
          "format": "int64",
          "example": 1
        }
      }
    }
  }
}
`;

export { document };
